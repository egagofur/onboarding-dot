import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { IMovieTags } from 'interface-models/movie/movie-tags.interface';

export class MovieUpdateRequest {
    @IsNotEmpty({ message: 'Field wajib diisi' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Field wajib diisi' })
    @IsString()
    overview: string;

    @IsOptional()
    @IsString()
    poster?: string;

    @IsNotEmpty({ message: 'Field wajib diisi' })
    @IsString()
    playUntil: Date;

    @IsNotEmpty({ message: 'Field wajib diisi' })
    tags?: IMovieTags[];

    @IsNotEmpty({ message: 'Field wajib diisi' })
    shedule?: IMovieSchedule[];
}
