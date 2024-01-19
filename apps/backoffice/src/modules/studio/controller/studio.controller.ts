import { Controller } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';

@Controller('studios')
export class StudioController {
    constructor(private readonly inertiaAdapter: InertiaAdapter) {}
}
