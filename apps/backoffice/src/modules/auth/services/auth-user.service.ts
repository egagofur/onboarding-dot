import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/iam/user.entity';
import { IUser } from 'interface-models/iam/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneByEmail(email: string): Promise<IUser> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    async findOneById(id: number): Promise<IUser> {
        return await this.userRepository.findOne({
            where: { id },
        });
    }

    async isUserExistsByEmail(email: string): Promise<boolean> {
        const user = await this.findOneByEmail(email);

        return !!user;
    }

    async createUser(data: IUser): Promise<IUser> {
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
    }
}
