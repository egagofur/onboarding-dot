import { IBaseEntity } from 'interface-models/base-entity.interface';

export interface IStudio extends IBaseEntity {
    id: number;
    studioNumber: number;
    seatCapacity: number;
}
