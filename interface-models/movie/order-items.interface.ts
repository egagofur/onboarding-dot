import { IBaseEntity } from 'interface-models/base-entity.interface';
import { IOrder } from './order.interface';
import { IMovieSchedule } from './movie-schedule.interface';

export interface IOrderItems extends IBaseEntity {
    id: number;
    order: IOrder;
    schedule: IMovieSchedule;
    qty: number;
    price: number;
    subTotalPrice: number;
    snapShot: string;
}
