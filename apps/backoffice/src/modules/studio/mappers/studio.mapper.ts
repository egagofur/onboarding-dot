import { IStudio } from 'interface-models/movie/studio.interface';

export class StudioMapper {
    public static fromEntity = (studio: IStudio) => ({
        seatCapacity: studio.seatCapacity,
        studioNumber: studio.studioNumber,
    });
}
