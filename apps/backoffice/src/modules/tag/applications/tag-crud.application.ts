import { Injectable } from '@nestjs/common';
import { TagService } from '../services/tag.service';

@Injectable()
export class TagCrudApplication {
    constructor(private readonly tagService: TagService) {}

    async findAll(): Promise<any[]> {
        return await this.tagService.findAll();
    }
}
