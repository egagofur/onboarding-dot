import { config } from 'apps/backoffice/src/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'interface-models/iam/user.interface';
import { User } from 'entities/iam/user.entity';
import { In, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthSchemaEnum } from 'apps/backoffice/src/common/enums/auth.enum';
import { LdapService } from '../../auth/services/ldap.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly ldapService: LdapService,
    ) {}

    async create(data: IUser): Promise<IUser> {
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
    }

    async validateUser(email: string, password: string): Promise<IUser> {
        switch (config.auth.schema) {
            case AuthSchemaEnum.Ldap:
                const isValid = this.ldapService.validate(email, password);
                if (isValid) return await this.findOneByEmail(email);
                break;

            case AuthSchemaEnum.Local:
                const user = await this.findOneByEmail(email);
                const isTrue = await bcrypt.compare(password, user.password);

                if (user && isTrue) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
                    return user;
                }
                break;
        }

        return null;
    }

    async findOneByEmail(email: string): Promise<IUser> {
        return await this.userRepository.findOneOrFail({
            where: { email },
        });
    }

    async findByRoleExceptIds(
        roleId: number,
        exceptIds: number[],
    ): Promise<IUser[]> {
        return await this.userRepository.find({
            where: { role: { id: roleId }, id: Not(In(exceptIds)) },
        });
    }

    async findOneByPhoneNumber(phoneNumber: string): Promise<IUser> {
        return await this.userRepository.findOneOrFail({
            where: { phoneNumber },
        });
    }

    async isEmailExists(email: string, exceptId = 0): Promise<boolean> {
        return (
            (await this.userRepository.findOne({
                where: { email, id: Not(exceptId) },
            })) != null
        );
    }

    async findByIdAndEmail(email: string, id: number): Promise<IUser> {
        const user = await this.userRepository.findOneOrFail({
            where: { id, email },
            relations: ['roles', 'roles.permissions'],
        });

        return user;
    }

    async findOneById(id: number): Promise<IUser> {
        const users = await this.userRepository.findOneOrFail({
            where: { id },
            relations: ['roles', 'roles.permissions'],
        });

        return users;
    }

    async findAllWithRole(roleId: number): Promise<IUser[]> {
        const dataUser = await this.userRepository.find({
            relations: ['roles', 'roles.permissions'],
        });

        const users = [];
        for (const user of dataUser) {
            for (const role of user.roles) {
                if (role.id == roleId) {
                    users.push(user);
                }
            }
        }

        return users;
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete({ id });
    }

    async bulkDelete(ids: number[]): Promise<void> {
        await this.userRepository.delete(ids);
    }

    async update(id: number, data: IUser): Promise<IUser> {
        await this.userRepository.update(id, data);
        return data;
    }
}
