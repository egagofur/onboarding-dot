import { LdapService } from './services/ldap.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/iam/user.entity';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { AuthApplication } from './applications/auth.application';
import { AuthController } from './controllers/auth.controller';
import { AdminAuthService } from './services/auth-admin.service';
import { UserService } from '../iam/services/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserSerializer } from './serializers/user.serializer';
import { UserCrudApplication } from '../iam/applications/user-crud.application';
import { OneSignalPushNotificationService } from '../../infrastructure/notification/services/one-signal-push-notification.service';
import { EmailNotificationService } from '../../infrastructure/notification/services/email-notification.service';
import { ForgotPasswordController } from '../auth/controllers/auth-forgot-password.controller';
import { AuthForgotPasswordApplication } from './applications/auth-forgot-password.application';
import { OtpService } from './services/otp.service';
import { Otp } from 'entities/otp/otp.entity';
import { CacheModule } from '../../infrastructure/cache/cache.module';
import { Role } from 'entities/iam/role.entity';
import { RoleService } from '../iam/services/role.service';
import { LogActivity } from 'entities/log-activity/log-activity.entity';
import { LogActivityService } from '../log-activity/services/log-activity.service';
import { UserRole } from 'entities/iam/user-role.entity';
import { UserRoleService } from '../iam/services/user-role.service';
import { Connection } from 'typeorm';
import { OidcStrategy, buildOpenIdClient } from './strategies/oidc.strategy';
import { RedisModule } from '../../infrastructure/redis';
import { FailSafeModule } from '../../infrastructure/fail-safe/fail-safe.module';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { MailService } from '../../infrastructure/mail/service/mail.service';
import { AuthUserService } from './services/auth-user.service';
import { BullModule } from '@nestjs/bull';
import { AuthSendEmailQueueProcessor } from './processors/auth.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Role,
            Otp,
            LogActivity,
            UserRole,
            Role,
        ]),
        PassportModule.register({
            session: true,
            defaultStrategy: 'local',
        }),
        CacheModule,
        RedisModule,
        FailSafeModule,
        MailModule,
        BullModule.registerQueue({
            name: 'send-email',
            limiter: {
                max: 1000,
                duration: 1000,
            },
        }),
    ],
    controllers: [AuthController, ForgotPasswordController],
    providers: [
        InertiaAdapter,
        AdminAuthService,
        UserService,
        RoleService,
        UserSerializer,
        AuthApplication,
        AuthForgotPasswordApplication,
        EmailNotificationService,
        OneSignalPushNotificationService,
        OtpService,
        MailService,
        AuthUserService,
        LocalStrategy,
        AuthSendEmailQueueProcessor,
        AdminAuthService,
        {
            provide: 'OidcStrategy',
            useFactory: async (connection: Connection) => {
                const userRepository = connection.getRepository(User);
                const userRoleRepository = connection.getRepository(UserRole);
                const roleRepository = connection.getRepository(Role);

                const client = await buildOpenIdClient();
                const strategy = new OidcStrategy(
                    roleRepository,
                    userRoleRepository,
                    userRepository,
                    client,
                );
                return strategy;
            },
            inject: [Connection],
        },
        UserCrudApplication,
        LogActivityService,
        LdapService,
        UserRoleService,
    ],
    exports: [],
})
export class AdminAuthModule {}
