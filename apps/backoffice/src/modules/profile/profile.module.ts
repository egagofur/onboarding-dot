import { RolePermission } from 'entities/iam/role-permission.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { ProfileController } from './controllers/profile.controller';
import { CacheModule } from '../../infrastructure/cache/cache.module';
import { ProfileApplication } from './applications/profile.application';
import { ProfileService } from './services/profile.service';
import { User } from 'entities/iam/user.entity';
import { Role } from 'entities/iam/role.entity';
import { Permission } from 'entities/iam/permission.entity';
import { ProfilePasswordController } from './controllers/profile-password.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Permission, RolePermission]),
        CacheModule,
    ],
    controllers: [ProfilePasswordController, ProfileController],
    providers: [InertiaAdapter, ProfileApplication, ProfileService],
})
export class ProfileModule {}
