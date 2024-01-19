import { Module } from '@nestjs/common';
import { WinstonModule as NestWinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
    imports: [
        NestWinstonModule.forRoot({
            transports: [
                new winston.transports.File({
                    filename: 'info.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                    ),
                }),
            ],
        }),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class WinstonModule {}
