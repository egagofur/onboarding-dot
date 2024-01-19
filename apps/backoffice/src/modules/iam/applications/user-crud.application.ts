import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IUser } from 'interface-models/iam/user.interface';
import { UserCreateRequest } from '../requests/user-create.request';
import { UserService } from '../services/user.service';
import { UserUpdateRequest } from '../requests/user-update.request';
import { config } from 'apps/backoffice/src/config';
import { CacheClear } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-clear.decorator';
import { Utils } from 'apps/backoffice/src/common/utils/util';
import { Role } from 'entities/iam/role.entity';
import { getManager } from 'typeorm';
import { UserRoleService } from '../services/user-role.service';
import { UserRole } from 'entities/iam/user-role.entity';

@Injectable()
export class UserCrudApplication {
    constructor(
        private readonly adminService: UserService,
        private readonly userRoleService: UserRoleService,
    ) {}

    @CacheClear(config.cache.name.users.detail)
    async create(userRequest: UserCreateRequest): Promise<void> {
        const emailExists = await this.adminService.isEmailExists(
            userRequest.email,
        );

        if (emailExists) {
            throw new UnprocessableEntityException(
                `User ${userRequest.email} has already exists`,
            );
        }

        const newUser = <IUser>{
            fullname: userRequest.fullname,
            email: userRequest.email,
            phoneNumber: userRequest.phoneNumber,
            identityNumber: userRequest.phoneNumber,
            password: await Utils.bcryptHash(userRequest.password),
        };

        const createdUser = await this.adminService.create(newUser);

        const roles = await getManager()
            .getRepository(Role)
            .findByIds(userRequest.roles);

        const userRoles: UserRole[] = [];
        roles.forEach((role) => {
            const userRole = new UserRole();
            userRole.role = role;
            userRole.user = createdUser;
            userRoles.push(userRole);
        });

        this.userRoleService.bulkSave(userRoles);
    }

    async findById(id: number): Promise<IUser> {
        const results = await this.adminService.findOneById(id);
        return results;
    }

    async findByRole(id: number): Promise<IUser[]> {
        const results = await this.adminService.findAllWithRole(id);
        return results;
    }

    async findByPhoneNumber(phoneNumber: string): Promise<IUser> {
        const results = await this.adminService.findOneByPhoneNumber(
            phoneNumber,
        );
        return results;
    }

    async findAllWithRole(roleId: number): Promise<IUser[]> {
        const results = await this.adminService.findAllWithRole(roleId);
        return results;
    }

    async bulkDelete(ids: number[]): Promise<void> {
        await this.adminService.bulkDelete(ids);
    }

    @CacheClear(config.cache.name.users.detail)
    async delete(id: number): Promise<void> {
        await this.adminService.delete(id);
    }

    @CacheClear(config.cache.name.users.detail)
    async update(id: number, request: UserUpdateRequest): Promise<void> {
        const userExists = await this.adminService.findByIdAndEmail(
            request.email,
            id,
        );

        if (!userExists) {
            throw new UnprocessableEntityException(
                `Email ${request.email} is not exists`,
            );
        }

        const updateUser = <IUser>{
            id: id,
            fullname: request.fullname,
            email: request.email,
            phoneNumber: request.phoneNumber,
        };

        if (request.password) {
            updateUser.password = await Utils.bcryptHash(request.password);
        }
        // save to user_role table
        const updatedUser = await this.adminService.update(id, {
            ...updateUser,
        });

        if (userExists.roles.length > 0) {
            await this.userRoleService.deleteByUserId(id);
        }

        const roles = await getManager()
            .getRepository(Role)
            .findByIds(request.roles);

        const userRoles: UserRole[] = [];
        roles.forEach((role) => {
            const userRole = new UserRole();
            userRole.role = role;
            userRole.user = updatedUser;
            userRoles.push(userRole);
        });

        this.userRoleService.bulkSave(userRoles);
    }
}
