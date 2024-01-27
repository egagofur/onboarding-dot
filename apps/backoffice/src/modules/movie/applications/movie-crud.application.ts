import {
    BadRequestException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { MovieCreateRequest } from '../request/movie-create.request';
import { IMovie } from 'interface-models/movie/movie.interface';
import { MovieUpdateRequest } from '../request/movie-update.request';
import { getManager } from 'typeorm';
import { Tag } from 'entities/movie/tag.entity';
import { MovieTags } from 'entities/movie/movie-tags.entity';
import { MovieTagService } from '../../movie-tag/services/movie-tag.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { config } from 'apps/backoffice/src/config';
@Injectable()
export class MovieCrudApplication {
    constructor(
        @InjectQueue('image-upload-queue') private fileQueue: Queue,
        private readonly movieService: MovieService,
        private readonly movieTagsService: MovieTagService,
    ) {}

    async uploadGeneral(file: Express.Multer.File): Promise<string> {
        if (file.size > config.upload.image.maxSize.inMb * 1024000) {
            throw new BadRequestException(
                'File yang di upload lebih dari ' +
                    config.upload.image.maxSize.inMb +
                    'MB',
            );
        }

        await this.fileQueue.add('upload-file', { file: file });
        const local = config.storage.path;
        const path = file.path.split('/');

        return `${local}/uploads/${path[path.length - 1]}-compressed-${
            file.originalname
        }`;
    }

    async create(movieRequest: MovieCreateRequest): Promise<void> {
        const isMovieExist = await this.movieService.isMovieExistsByTitle(
            movieRequest.title,
        );

        if (isMovieExist) {
            throw new UnprocessableEntityException(
                `Movie ${movieRequest.title} has already exists`,
            );
        }

        const newMovie = <IMovie>{
            title: movieRequest.title,
            overview: movieRequest.overview,
            playUntil: movieRequest.playUntil,
            poster: movieRequest.poster,
        };

        const createdMovie = await this.movieService.create(newMovie);

        const tags = await getManager()
            .getRepository(Tag)
            .findByIds(movieRequest.tags);

        const movieTags: MovieTags[] = [];
        tags.forEach((tag) => {
            const movieTag = new MovieTags();
            movieTag.movie = createdMovie;
            movieTag.tag = tag;
            movieTags.push(movieTag);
        });

        this.movieTagsService.bulkSave(movieTags);
    }

    async update(id: number, movieRequest: MovieUpdateRequest): Promise<void> {
        const isMovieExist = await this.movieService.findOneByIdAndTitle(
            id,
            movieRequest.title,
        );

        // @ts-ignore
        if (isMovieExist?.tag?.length > 0) {
            await this.movieTagsService.deleteByMovieId(id);
        }

        const updateMovie = <IMovie>{
            id: id,
            title: movieRequest.title,
            overview: movieRequest.overview,
            playUntil: movieRequest.playUntil,
            poster: movieRequest.poster,
        };

        const updatedMovie = await this.movieService.update(id, {
            ...updateMovie,
        });

        const tags = await getManager()
            .getRepository(Tag)
            .findByIds(movieRequest.tags);

        const movieTags: MovieTags[] = [];
        tags.forEach((tag) => {
            const movieTag = new MovieTags();
            movieTag.tag = tag;
            movieTag.movie = updatedMovie;
            movieTags.push(movieTag);
        });

        await this.movieTagsService.bulkSave(movieTags);
    }

    async delete(id: number): Promise<void> {
        await this.movieService.delete(id);
    }

    async findById(id: number): Promise<IMovie> {
        const results = await this.movieService.findOneById(id);
        return results;
    }

    async findAll(): Promise<IMovie[]> {
        const results = await this.movieService.findAll();
        return results;
    }

    async findAllById(ids: number[]): Promise<IMovie[]> {
        const results = await this.movieService.findAllById(ids);
        return results;
    }

    async findOneByTitle(title: string): Promise<IMovie> {
        const results = await this.movieService.findOneByTitle(title);
        return results;
    }
}
