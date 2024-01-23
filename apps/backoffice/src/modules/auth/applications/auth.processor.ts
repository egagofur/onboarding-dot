import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { EmailNotificationService } from 'apps/backoffice/src/infrastructure/notification/services/email-notification.service';
import { Job } from 'bull';

@Injectable()
@Processor('send-email')
export class AuthSendEmailQueueProcessor {
    constructor(
        private readonly emailNotificationService: EmailNotificationService,
    ) {}

    @Process('sendEmail')
    async processEmail(job: Job) {
        try {
            const { to, subject, template, data } = job.data;

            await this.emailNotificationService.sendEmail(
                subject,
                data,
                template,
                to,
            );
            console.log('[ Queue sendEmail executed ] - Sucess ', to);
        } catch (error) {
            console.log('[ Queue sendEmail executed ] - Failed ', error);
        }
    }
}
