import { ITags } from 'interface-models/movie/tags.interface';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'entities/base.entity';
import { Movie } from './movie.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity implements ITags {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Movie, (movie) => movie.id, { onDelete: 'CASCADE' })
    @JoinTable({
        name: 'movie_tags',
        joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    })
    movie: Movie[];

    @Column()
    @IsNotEmpty()
    name: string;
}
