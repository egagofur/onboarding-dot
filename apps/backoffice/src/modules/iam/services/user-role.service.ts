import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserRole } from 'entities/iam/user-role.entity';
import { IUserRole } from 'interface-models/iam/user-role.interface';

@Injectable()
export class UserRoleService {
    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) {}

    async deleteByUserId(userId: number): Promise<void> {
        const status = await this.userRoleRepository.delete({
            user: { id: userId },
        });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async bulkSave(data: IUserRole[]): Promise<IUserRole[]> {
        const userRoles = this.userRoleRepository.create(data);
        return await this.userRoleRepository.save(userRoles);
    }
}
