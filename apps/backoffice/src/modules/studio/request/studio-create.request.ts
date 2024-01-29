import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class StudioCreateRequest {
    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsNumber()
    studioNumber: number;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsNumber()
    seatCapacity: number;

    @IsNumber()
    @IsOptional()
    id?: number;
}
