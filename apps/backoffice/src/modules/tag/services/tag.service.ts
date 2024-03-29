import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'entities/movie/tag.entity';
import { ITags } from 'interface-models/movie/tags.interface';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>,
    ) {}

    async findAll(): Promise<ITags[]> {
        return await this.tagsRepository.find();
    }

    async findOneById(id: number): Promise<ITags> {
        return await this.tagsRepository.findOneOrFail({
            where: { id },
        });
    }

    async findOneByName(name: string): Promise<ITags> {
        return await this.tagsRepository.findOneOrFail({
            where: {
                name,
            },
        });
    }

    async create(data: ITags): Promise<ITags> {
        const newTags = this.tagsRepository.create(data);
        return await this.tagsRepository.save(newTags);
    }

    async update(id: number, data: ITags): Promise<ITags> {
        const status = await this.tagsRepository.update({ id }, { ...data });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    async delete(id: number): Promise<void> {
        const status = await this.tagsRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async isTagExistName(name: string): Promise<boolean> {
        const tag = await this.tagsRepository.findOne({
            where: { name },
        });
        return tag !== null;
    }

    async findAllById(ids: number[]): Promise<ITags[]> {
        return await this.tagsRepository.find({
            where: {
                id: ids,
            },
        });
    }

    async bulkDelete(ids: number[]): Promise<void> {
        await this.tagsRepository.delete(ids);
    }

    async findAllByIds(ids: number[]): Promise<ITags[]> {
        return this.tagsRepository.findByIds(ids);
    }
}
