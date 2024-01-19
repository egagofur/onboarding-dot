import { IBaseEntity } from 'interface-models/base-entity.interface';
import { IMovie } from './movie.interface';
import { ITags } from './tags.interface';

export interface IMovieTags extends IBaseEntity {
    id: number;
    movie: IMovie;
    tags: ITags;
}
