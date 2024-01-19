import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Min } from 'class-validator';
import { IMovie } from 'interface-models/movie/movie.interface';
import { IStudio } from 'interface-models/movie/studio.interface';
import { BaseEntity } from 'entities/base.entity';
import { Studio } from './studio.entity';
import { Movie } from './movie.entity';

@Entity({ name: 'movie_schedules' })
export class MovieSchedule extends BaseEntity implements IMovieSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Movie, (movie) => movie.id, { eager: true })
    @JoinColumn({ name: 'movie_id' })
    movie: IMovie;

    @ManyToOne(() => Studio, (studio) => studio.id, {
        onDelete: 'CASCADE',
        eager: true,
    })
    @JoinColumn({ name: 'studio_id' })
    studio: IStudio;

    @Column({ name: 'start_time' })
    startTime: Date;

    @Column({ name: 'end_time' })
    endTime: Date;

    @Column()
    @Min(0)
    price: number;

    @Column()
    date: Date;
}
