import { IBaseEntity } from 'interface-models/base-entity.interface';
import { IMovieTags } from './movie-tags.interface';
import { IMovieSchedule } from './movie-schedule.interface';

export interface IMovie extends IBaseEntity {
    id: number;
    tags?: IMovieTags[];
    shedule?: IMovieSchedule[];
    title: string;
    overview: string;
    poster?: string;
    playUntil: Date;
}
