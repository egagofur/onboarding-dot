import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogActivity } from 'entities/log-activity/log-activity.entity';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { LogActivityCrudApplication } from './applications/log-activity-crud.application';
import { LogActivityIndexApplication } from './applications/log-activity-index.application';
import { LogActivityController } from './controllers/log-activity.controller';
import { LogActivityService } from './services/log-activity.service';

@Module({
    imports: [TypeOrmModule.forFeature([LogActivity])],
    controllers: [LogActivityController],
    providers: [
        InertiaAdapter,
        LogActivityService,
        LogActivityCrudApplication,
        LogActivityIndexApplication,
    ],
    exports: [LogActivityService],
})
export class LogActivityModule {}
