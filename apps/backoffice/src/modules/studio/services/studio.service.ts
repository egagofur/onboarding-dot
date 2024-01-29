import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Studio } from 'entities/movie/studio.entity';
import { IStudio } from 'interface-models/movie/studio.interface';
import { In, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class StudioService {
    constructor(
        @InjectRepository(Studio)
        private readonly movieRepository: Repository<Studio>,
    ) {}

    async create(data: IStudio): Promise<IStudio> {
        const newStudio = this.movieRepository.create(data);
        return await this.movieRepository.save(newStudio);
    }

    async update(id: number, data: IStudio): Promise<IStudio> {
        const status = await this.movieRepository.update({ id }, { ...data });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.movieRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IStudio> {
        return await this.movieRepository.findOneOrFail({
            where: { id },
        });
    }

    async findOneByIdAndTitle(
        id: number,
        title: string,
    ): Promise<IStudio | null> {
        return await this.movieRepository.findOneOrFail({
            where: { id, title },
        });
    }

    async findAll(): Promise<IStudio[]> {
        return await this.movieRepository.find();
    }

    async findAllByIds(ids: number[]): Promise<IStudio[]> {
        return await this.movieRepository.find({
            where: { id: In(ids) },
        });
    }

    async isStudioExist(studioNumber): Promise<boolean> {
        const studio = await this.movieRepository.findOne({
            where: {
                studioNumber: studioNumber,
            },
        });
        return !!studio;
    }
}
