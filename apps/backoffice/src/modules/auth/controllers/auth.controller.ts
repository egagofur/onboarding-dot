import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { Request, Response } from 'express';
import { AuthApplication } from '../applications/auth.application';
import { LocalGuard } from '../guards/local.guard';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { LoggedOutGuard } from '../guards/logged-out.guard';
import { OidcGuard } from '../guards/oidc.guard';
import { FailSafeCheck } from 'apps/backoffice/src/infrastructure/fail-safe/decorators/fail-safe.decorator';
import { MailService } from 'apps/backoffice/src/infrastructure/mail/service/mail.service';
import { UserRegisterRequest } from '../requests/user-register.request';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly authApplication: AuthApplication,
        private readonly mailService: MailService,
    ) {}

    @Get('login')
    @FailSafeCheck()
    @UseGuards(LoggedOutGuard)
    async loginPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Login',
        });
    }

    @Get('register')
    @FailSafeCheck()
    @UseGuards(LoggedOutGuard)
    async registerPage(): Promise<void> {
        const getRoles = await this.authApplication.getAllRoles();
        return this.inertiaAdapter.render({
            component: 'Register',
            props: {
                roles: getRoles,
            },
        });
    }

    @Get('sso-oidc/redirect')
    async SSOOIDCRedirectPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'SSORedirectPage',
        });
    }

    @UseGuards(OidcGuard)
    @Get('sso-oidc/callback')
    async SSOOIDCCallbaack(@Res() res: Response): Promise<void> {
        return res.redirect('/');
    }

    @UseGuards(OidcGuard)
    @Get('sso-oidc')
    async loginSSOPage(): Promise<void> {
        console.log('[Redirect] to SSO Login Page');
    }

    @UseGuards(LocalGuard)
    @Post('login')
    async login(
        @Query('one_signal_player_id') playerId: string,
        @Req() req: Request,
    ): Promise<void> {
        const id = req.user['id'];

        await this.authApplication.loginAttempt(id, playerId);

        return this.inertiaAdapter.successResponse('/', 'Success Login');
    }

    @Post('register')
    async register(@Body() data: UserRegisterRequest): Promise<void> {
        await this.authApplication.registerUser(data);

        return this.inertiaAdapter.successResponse('/', 'Success Register');
    }

    @UseGuards(LoggedInGuard)
    @Get('logout')
    async logout(
        @Query('one_signal_player_id') playerId: string,
        @Res() res: Response,
    ): Promise<void> {
        await this.authApplication.logout(playerId);
        return res.redirect('/');
    }
}
