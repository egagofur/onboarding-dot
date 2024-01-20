import { BaseEntity } from 'entities/base.entity';
import { IMovieTags } from 'interface-models/movie/movie-tags.interface';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { IMovie } from 'interface-models/movie/movie.interface';
import { ITags } from 'interface-models/movie/tags.interface';
import { Tag } from './tag.entity';

@Entity({ name: 'movie_tags' })
export class MovieTags extends BaseEntity implements IMovieTags {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Movie, (movie) => movie.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    movie: IMovie;

    @ManyToOne(() => Tag, (tag) => tag.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tags_id' })
    tag: ITags;
}
