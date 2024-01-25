import { Module } from '@nestjs/common';
import { StudioService } from './services/studio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studio } from 'entities/movie/studio.entity';
import { StudioController } from './controllers/studio.controller';
import { StudioCrudApplication } from './applications/studio-crud.application';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { StudioIndexApplication } from './applications/studio-index.application';

@Module({
    imports: [TypeOrmModule.forFeature([Studio])],
    providers: [
        StudioService,
        StudioCrudApplication,
        InertiaAdapter,
        StudioIndexApplication,
    ],
    controllers: [StudioController],
    exports: [StudioCrudApplication],
})
export class StudioModule {}
