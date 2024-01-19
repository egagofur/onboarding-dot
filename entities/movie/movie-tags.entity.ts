import { BaseEntity } from 'entities/base.entity';
import { IMovieTags } from 'interface-models/movie/movie-tags.interface';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { Tags } from './tags.entity';
import { IMovie } from 'interface-models/movie/movie.interface';
import { ITags } from 'interface-models/movie/tags.interface';

@Entity({ name: 'movie_tags' })
export class MovieTags extends BaseEntity implements IMovieTags {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Movie, (movie) => movie.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    movie: IMovie;

    @ManyToOne(() => Tags, (tag) => tag.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tags_id' })
    tags: ITags;
}
