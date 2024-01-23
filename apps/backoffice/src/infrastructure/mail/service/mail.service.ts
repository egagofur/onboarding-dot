import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'entities/iam/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User) {
        await this.mailerService
            .sendMail({
                to: user.email,
                subject: 'Welcome to Nice App! Confirm your Email',
                template: 'mail-test',
                context: {
                    name: user.fullname,
                },
            })
            .catch((e) => {
                console.log('[Email Sender Ega] - Error ' + e.message);
            })
            .finally(() => {
                console.log('[Email Sender Ega] - Sent');
            });
    }
}
