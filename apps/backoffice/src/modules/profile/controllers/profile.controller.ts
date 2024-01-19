import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { IUser } from 'interface-models/iam/user.interface';
import { LoggedInGuard } from '../../auth/guards/logged-in.guard';
import { GetUserLogged } from '../../iam/decorators/get-user.decorator';
import { ProfileApplication } from '../applications/profile.application';
import { ProfileEditRequest } from '../requests/profile-edit.request';

@Controller('profile')
@UseGuards(LoggedInGuard)
export class ProfileController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly profileApplication: ProfileApplication,
    ) {}

    @Get()
    async detailPage(@GetUserLogged() user: IUser): Promise<void> {
        const data = await this.profileApplication.findOneById(user.id);
        return this.inertiaAdapter.render({
            component: 'Profile',
            props: {
                data,
            },
        });
    }

    @Get('edit')
    async editPage(@GetUserLogged() user: IUser): Promise<void> {
        const data = await this.profileApplication.findOneById(user.id);
        return this.inertiaAdapter.render({
            component: 'Profile/FormProfile',
            props: {
                data,
            },
        });
    }

    @Put('edit')
    async edit(
        @GetUserLogged() user: IUser,
        @Body() request: ProfileEditRequest,
    ): Promise<void> {
        await this.profileApplication.edit(user.id, request);
        this.inertiaAdapter.share('success');
        return this.inertiaAdapter.successResponse('/profile', 'Sukses edit');
    }
}
