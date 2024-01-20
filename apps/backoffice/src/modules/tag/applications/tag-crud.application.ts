import { Injectable } from '@nestjs/common';
import { TagService } from '../services/tag.service';

@Injectable()
export class TagCrudApplication {
    constructor(private readonly tagService: TagService) {}

    async createTag() {
        return 'createTag';
    }
}
