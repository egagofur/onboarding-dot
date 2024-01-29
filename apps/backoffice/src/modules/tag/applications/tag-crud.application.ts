import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { ITags } from 'interface-models/movie/tags.interface';

@Injectable()
export class TagCrudApplication {
    constructor(private readonly tagService: TagService) {}

    async findAll(): Promise<ITags[]> {
        return await this.tagService.findAll();
    }

    async findOneById(id: number): Promise<ITags> {
        return await this.tagService.findOneById(id);
    }

    async findOneByName(name: string): Promise<ITags> {
        return await this.tagService.findOneByName(name);
    }

    async create(data: ITags): Promise<ITags> {
        const isTagExist = await this.tagService.isTagExistName(data.name);
        if (!isTagExist) {
            throw new UnprocessableEntityException(
                `Tag ${data.name} has already exists`,
            );
        }

        return await this.tagService.create(data);
    }

    async update(id: number, data: ITags): Promise<ITags> {
        const isTagExist = await this.tagService.isTagExistName(data.name);
        if (!isTagExist) {
            throw new UnprocessableEntityException(
                `Tag ${data.name} has already exists`,
            );
        }

        return await this.tagService.update(id, data);
    }

    async delete(id: number): Promise<void> {
        return await this.tagService.delete(id);
    }

    async findAllById(ids: number[]): Promise<ITags[]> {
        return await this.tagService.findAllById(ids);
    }
}
