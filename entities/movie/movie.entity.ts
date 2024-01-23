import { BaseEntity } from 'entities/base.entity';
import { IMovie } from 'interface-models/movie/movie.interface';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity({ name: 'movies' })
export class Movie extends BaseEntity implements IMovie {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Tag, (tag) => tag.id, { onDelete: 'CASCADE' })
    @JoinTable({
        name: 'movie_tags',
        joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tag: Tag[];

    @Column()
    title: string;

    @Column()
    overview: string;

    @Column()
    poster?: string;

    @Column({ name: 'play_until' })
    playUntil: Date;
}
