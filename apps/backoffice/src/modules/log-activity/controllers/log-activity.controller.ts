import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import {
    PERMISSION_BACKOFFICE_DETAIL_LOG_ACTIVITY,
    PERMISSION_BACKOFFICE_SHOW_LOG_ACTIVITY,
} from 'constants/permission.constant';
import { PermissionGuard } from '../../auth/guards/permission.guard';

import { LogActivityCrudApplication } from '../applications/log-activity-crud.application';
import { LogActivityIndexApplication } from '../applications/log-activity-index.application';
import { LogActivityIndexRequest } from '../requests/log-activity-index.request';
import { LogActivityResponse } from '../responses/log-activity.response';

@Controller('logs')
export class LogActivityController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly logActivityCrudApplication: LogActivityCrudApplication,
        private readonly logActivityIndexApplication: LogActivityIndexApplication,
    ) {}

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_SHOW_LOG_ACTIVITY))
    @Get()
    async indexPage(
        @Query() indexRequest: LogActivityIndexRequest,
    ): Promise<void> {
        const response = await this.logActivityIndexApplication.fetch(
            indexRequest,
        );

        return this.inertiaAdapter.render({
            component: 'LogActivities',
            props: {
                data: LogActivityResponse.fromEntities(response.data),
                meta: response.meta,
            },
        });
    }

    @UseGuards(PermissionGuard(PERMISSION_BACKOFFICE_DETAIL_LOG_ACTIVITY))
    @Get(':id')
    async detailPage(@Param('id') id: number): Promise<void> {
        const data = await this.logActivityCrudApplication.findOneById(id);
        return this.inertiaAdapter.render({
            component: 'LogActivities/DetailLogActivity',
            props: {
                data: LogActivityResponse.fromEntity(data),
            },
        });
    }
}
