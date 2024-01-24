import { IsNotEmpty, IsString } from 'class-validator';

export class TagUpdateRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
}
