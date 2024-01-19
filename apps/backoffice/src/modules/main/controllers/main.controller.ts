import { Controller, Get } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';

@Controller()
export class MainController {
    constructor(private readonly inertiaAdapter: InertiaAdapter) {}

    @Get()
    async indexPage(): Promise<void> {
        return this.inertiaAdapter.successResponse('/', 'Wellcome');
    }

    @Get('server-error')
    async serverErrorPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'ServerError',
        });
    }

    @Get('forbidden-error')
    async forbiddenErrorPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'ForbiddenError',
        });
    }

    @Get('not-found-error')
    async notFoundErrorPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'NotFoundError',
        });
    }
}
