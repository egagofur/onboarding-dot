import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class StudioEditRequest {
    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsNumber()
    studioNumber: number;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsNumber()
    @Min(1)
    seatCapacity: number;

    @IsNumber()
    @IsOptional()
    id?: number;
}
