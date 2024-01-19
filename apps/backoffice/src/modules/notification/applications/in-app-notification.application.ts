import { Injectable } from '@nestjs/common';
import { IInAppNotification } from 'interface-models/notification/in-app-notification.interface';
import { InAppNotificationMarkReadRequest } from '../requests/in-app-notification-mark-read.request';
import { InAppNotificationService } from '../services/in-app-notifiacation.service';

@Injectable()
export class InAppNotificationApplication {
    constructor(
        private readonly notificationService: InAppNotificationService,
    ) {}

    async findOneById(id: number): Promise<IInAppNotification> {
        return await this.notificationService.findOneById(id);
    }

    async markReadAll(): Promise<void> {
        const notifications = await this.notificationService.find();
        notifications.forEach(async (data) => {
            await this.notificationService.markRead(data.id);
        });
    }

    async markReadMany(
        request: InAppNotificationMarkReadRequest,
    ): Promise<void> {
        request.notificationIds.forEach(async (data) => {
            await this.notificationService.markRead(data);
        });
    }
}
