import { IsNotEmpty, IsString } from 'class-validator';

export class TagsCreateRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
}
