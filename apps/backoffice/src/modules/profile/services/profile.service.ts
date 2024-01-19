import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'apps/backoffice/src/config';
import { CacheClear } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-clear.decorator';
import { User } from 'entities/iam/user.entity';
import { IUser } from 'interface-models/iam/user.interface';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly profileRepository: Repository<User>,
    ) {}

    async findOneById(id: number): Promise<IUser> {
        return await this.profileRepository.findOneOrFail({
            where: { id },
        });
    }

    @CacheClear(config.cache.name.users.list)
    async update(id: number, data: IUser): Promise<IUser> {
        const status = await this.profileRepository.update({ id }, { ...data });

        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }
}
