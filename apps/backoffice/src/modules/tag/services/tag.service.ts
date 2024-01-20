import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from 'entities/movie/tags.entity';
import { ITags } from 'interface-models/movie/tags.interface';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>,
    ) {}

    async findAll(): Promise<any[]> {
        return await this.tagsRepository.find();
    }

    async findOneById(id: number): Promise<any> {
        return await this.tagsRepository.findOneOrFail({
            where: { id },
        });
    }

    async findOneByName(name: string): Promise<any> {
        return await this.tagsRepository.findOneOrFail({
            where: {
                name,
            },
        });
    }

    async create(data: ITags): Promise<any> {
        const newTags = this.tagsRepository.create(data);
        return await this.tagsRepository.save(newTags);
    }

    async update(id: number, data: ITags): Promise<any> {
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

    async isMovieExistName(name: string): Promise<boolean> {
        const movie = await this.tagsRepository.findOne({
            where: { name },
        });
        return movie !== null;
    }

    async findAllById(ids: number[]): Promise<any[]> {
        return await this.tagsRepository.find({
            where: {
                id: ids,
            },
        });
    }

    async bulkDelete(ids: number[]): Promise<void> {
        await this.tagsRepository.delete(ids);
    }
}
