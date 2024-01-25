import { IsNumber, IsOptional } from 'class-validator';

export class StudioEditRequest {
    @IsNumber()
    studioNumber: number;

    @IsNumber()
    seatCapacity: number;

    @IsNumber()
    @IsOptional()
    id?: number;
}
