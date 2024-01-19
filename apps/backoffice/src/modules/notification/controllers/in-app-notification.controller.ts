import {
    Controller,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { IUser } from 'interface-models/iam/user.interface';
import { LoggedInGuard } from '../../auth/guards/logged-in.guard';
import { GetUserLogged } from '../../iam/decorators/get-user.decorator';
import { InAppNotificationIndexApplication } from '../applications/in-app-notification-index.application';
import { InAppNotificationApplication } from '../applications/in-app-notification.application';
import { InAppNotificationIndexRequest } from '../requests/in-app-notification-index.request';
import { InAppNotificationMarkReadRequest } from '../requests/in-app-notification-mark-read.request';

@Controller('notifications')
@UseGuards(LoggedInGuard)
export class InAppNotificationController {
    constructor(
        private readonly inAppNotificationIndexApplication: InAppNotificationIndexApplication,
        private readonly inAppNotificationApplication: InAppNotificationApplication,
        private readonly inertiaAdapter: InertiaAdapter,
    ) {}

    @Get()
    async fetch(
        @Query() indexRequest: InAppNotificationIndexRequest,
        @GetUserLogged() user: IUser,
    ): Promise<void> {
        const response = await this.inAppNotificationIndexApplication.fetch(
            indexRequest,
            user,
        );

        return this.inertiaAdapter.render({
            component: 'Notifications',
            props: {
                title: 'Notifications',
                ...response,
            },
        });
    }

    @Get(':id')
    async findOneAndMarkRead(@Param('id') id: number): Promise<void> {
        const dataMarkRead = new InAppNotificationMarkReadRequest();
        dataMarkRead.notificationIds = [id];
        await this.inAppNotificationApplication.markReadMany(dataMarkRead);

        const data = await this.inAppNotificationApplication.findOneById(id);
        return this.inertiaAdapter.render({
            component: 'Notifications/DetailNotification',
            props: {
                title: 'Detail Notification',
                data,
            },
        });
    }

    @Patch('mark-read-all')
    async markReadAll(): Promise<void> {
        await this.inAppNotificationApplication.markReadAll();
        this.inertiaAdapter.share('success');
        return this.inertiaAdapter.successResponse(
            '/notifications',
            'Sukses mark all',
        );
    }
}
