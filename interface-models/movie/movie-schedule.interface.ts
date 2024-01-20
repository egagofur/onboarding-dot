import { IBaseEntity } from 'interface-models/base-entity.interface';
import { IMovie } from './movie.interface';
import { IStudio } from './studio.interface';

export interface IMovieSchedule extends IBaseEntity {
    id: number;
    movie: IMovie;
    studios: IStudio;
    startTime: Date;
    endTime: Date;
    price: number;
    date: Date;
}
