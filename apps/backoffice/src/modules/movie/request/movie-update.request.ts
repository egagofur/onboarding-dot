import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class MovieUpdateRequest {
    @IsNotEmpty({ message: 'Field wajib diisi' })
    @IsString({ message: 'Field harus berupa string' })
    @MinLength(3, { message: 'Minimal 3 karakter' })
    @MaxLength(100, { message: 'Maksimal 100 karakter' })
    title: string;

    @IsNotEmpty({ message: 'Field wajib diisi' })
    @IsString()
    @MinLength(3, { message: 'Minimal 3 karakter' })
    @MaxLength(250, { message: 'Maksimal 250 karakter' })
    overview: string;

    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Minimal 3 karakter' })
    @MaxLength(250, { message: 'Maksimal 250 karakter' })
    poster?: string;

    @IsNotEmpty({ message: 'Field wajib diisi' })
    @IsDate()
    playUntil: Date;

    @ArrayNotEmpty({ message: 'Field wajib diisi' })
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(1, { each: true })
    tagsId?: number[];
}
