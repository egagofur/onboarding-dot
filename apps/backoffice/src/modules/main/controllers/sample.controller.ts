import { Controller, Get } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';

@Controller('sample')
// @UseGuards(LoggedInGuard)
export class SampleController {
    constructor(private readonly inertiaAdapter: InertiaAdapter) {}

    @Get('form/basic')
    async formBasicPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Sample/Form/FormBasic',
        });
    }

    @Get('form/step')
    async formStepPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Sample/Form/FormStep',
        });
    }

    @Get('form/advanced')
    async formAdvancedPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Sample/Form/FormAdvanced',
        });
    }

    @Get('detail/basic')
    async detailBasicPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Sample/Detail/DetailBasic',
        });
    }

    @Get('detail/advanced')
    async detailAdvancedPage(): Promise<void> {
        return this.inertiaAdapter.render({
            component: 'Sample/Detail/DetailAdvanced',
        });
    }
}
