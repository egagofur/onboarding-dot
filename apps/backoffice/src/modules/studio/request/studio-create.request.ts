import { IsNumber, IsOptional } from 'class-validator';

export class StudioCreateRequest {
    @IsNumber()
    studioNumber: number;

    @IsNumber()
    seatCapacity: number;

    @IsNumber()
    @IsOptional()
    id?: number;
}
