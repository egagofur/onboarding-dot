import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    Process,
    Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { EmailNotificationService } from 'apps/backoffice/src/infrastructure/notification/services/email-notification.service';
import { Job } from 'bull';

@Injectable()
@Processor('send-email')
export class AuthSendEmailQueueProcessor {
    constructor(
        private readonly emailNotificationService: EmailNotificationService,
    ) {}

    @OnQueueActive()
    onActive(job: Job) {
        Logger.log(
            `Processing job ${job.id} of type ${job.name}.`,
            'FileUploadProcessor',
        );
    }

    @OnQueueError()
    onError(error: Error) {
        Logger.error(
            `Error processing job: ${error.message}`,
            'FileUploadProcessor',
        );
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        Logger.log(
            `Completed job ${job.id} of type ${job.name}.`,
            'FileUploadProcessor',
        );
    }

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
