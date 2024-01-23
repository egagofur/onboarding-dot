import { LogActivityMenuEnum } from 'apps/backoffice/src/common/enums/log-activity.enum';
import {
    Inject,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EmailNotificationService } from 'apps/backoffice/src/infrastructure/notification/services/email-notification.service';
import { OneSignalPushNotificationService } from '../../../infrastructure/notification/services/one-signal-push-notification.service';
import { AdminAuthService } from '../services/auth-admin.service';
import { Request } from 'express';
import { LogActivityService } from '../../log-activity/services/log-activity.service';
import { IUser } from 'interface-models/iam/user.interface';
import { AuthUserService } from '../services/auth-user.service';
import { MailService } from 'apps/backoffice/src/infrastructure/mail/service/mail.service';
import { UserRegisterRequest } from '../requests/user-register.request';
import { UserRoleService } from '../../iam/services/user-role.service';
import { Utils } from 'apps/backoffice/src/common/utils/util';
import { getManager } from 'typeorm';
import { Role } from 'entities/iam/role.entity';
import { UserRole } from 'entities/iam/user-role.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthApplication {
    constructor(
        @Inject(REQUEST) private readonly request: Request,
        @InjectQueue('send-email') private sendEmailQueue: Queue,
        private readonly adminAuthService: AdminAuthService,
        private readonly oneSignalPushNotificationService: OneSignalPushNotificationService,
        private readonly emailNotificationService: EmailNotificationService,
        private readonly logActivityService: LogActivityService,
        private readonly authUserService: AuthUserService,
        private readonly emailService: MailService,
        private readonly userRoleService: UserRoleService,
    ) {}

    async addOneSignalPlayerIdById(
        id: number,
        playerId: string,
    ): Promise<void> {
        await this.adminAuthService.addOneSignalPlayerIdById(id, playerId);
        await this.oneSignalPushNotificationService.setStatus(playerId, true);
        this.request.session['playerId'] = playerId || null;
    }

    async registerUser(data: UserRegisterRequest): Promise<void> {
        const isUserExists = await this.authUserService.isUserExistsByEmail(
            data.email,
        );

        if (isUserExists) {
            throw new UnprocessableEntityException('Email already registered');
        }

        const newUser = <IUser>{
            fullname: data.fullname,
            email: data.email,
            phoneNumber: data.phoneNumber,
            identityNumber: data.phoneNumber,
            password: await Utils.bcryptHash(data.password),
        };

        try {
            await this.sendEmailQueue.add('sendEmail', {
                to: data.email,
                subject: 'Register Attempt',
                template: 'mail-test',
                data: {},
            });
        } catch (error) {
            console.log(error);
        }

        const createdUser = await this.authUserService.createUser(newUser);

        const roles = await getManager()
            .getRepository(Role)
            .findByIds(data.roles);

        const userRoles: UserRole[] = [];
        roles.forEach((role) => {
            const userRole = new UserRole();
            userRole.role = role;
            userRole.user = createdUser;
            userRoles.push(userRole);
        });

        await this.userRoleService.bulkSave(userRoles);

        this.logActivityService.create({
            activity: 'user register with email ' + data.email,
            metaData: {
                email: data.email,
            },
            user: this.request.user as IUser,
            source: data.email,
            menu: LogActivityMenuEnum.AUTH,
            path: __filename,
        });
    }

    async loginAttempt(id: number, playerId: string): Promise<void> {
        const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                playerId,
            );
        if (isUUID) {
            await this.addOneSignalPlayerIdById(id, playerId);
        }

        try {
            const email = this.request.user['email'];
            await this.sendEmailQueue.add('sendEmail', {
                to: email,
                subject: 'Login Attempt',
                template: 'mail-test',
                data: {},
            });
        } catch (error) {
            console.log('error catch application' + error);
        }

        this.logActivityService.create({
            activity:
                'user with email ' + this.request.user['email'] + ' login',
            metaData: {
                email: this.request.user['email'],
            },
            user: this.request.user as IUser,
            source: id.toString(),
            menu: LogActivityMenuEnum.AUTH,
            path: __filename,
        });
    }

    async logout(playerId: string): Promise<void> {
        this.logActivityService.create({
            activity:
                'user with email ' + this.request.user['email'] + ' logout',
            metaData: {
                username: this.request.user['email'],
                password: this.request.user['password'],
            },
            user: this.request.user as IUser,
            source: this.request.user['id'].toString(),
            menu: LogActivityMenuEnum.AUTH,
            path: __filename,
        });

        const id = this.request.user['id'];
        this.request.session['playerId'] = null;
        await this.adminAuthService.removeOneSignalPlayerIdById(id, playerId);
        await this.oneSignalPushNotificationService.setStatus(playerId, false);
        this.request.logOut((done) => {
            console.log(done);
        });
    }

    async getAllRoles(): Promise<any> {
        return await this.adminAuthService.getAllRoles();
    }
}
