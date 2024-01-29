import { IsInt, Min, IsNotEmpty, IsString } from 'class-validator';

export class MovieScheduleCreateRequest {
    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsInt()
    movie_id: number;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsInt()
    studio_id: number;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsString()
    start_time: string;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsString()
    end_time: string;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsInt()
    @Min(0)
    price: number;

    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsString()
    date: string;
}
