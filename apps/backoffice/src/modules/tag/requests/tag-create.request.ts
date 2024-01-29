import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class TagsCreateRequest {
    @IsNotEmpty({
        message: 'Field wajib diisi',
    })
    @IsString()
    @MinLength(3, {
        message: 'Minimal 3 karakter',
    })
    @MaxLength(100, {
        message: 'Maksimal 100 karakter',
    })
    name: string;
}
