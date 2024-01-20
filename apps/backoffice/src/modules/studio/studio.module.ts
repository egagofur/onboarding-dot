import { Module } from '@nestjs/common';
import { StudioService } from './services/studio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studio } from 'entities/movie/studio.entity';
import { StudioController } from './controllers/studio.controller';
import { StudioCrudApplication } from './applications/studio-crud.application';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';

@Module({
    imports: [TypeOrmModule.forFeature([Studio])],
    providers: [StudioService, StudioCrudApplication, InertiaAdapter],
    controllers: [StudioController],
    exports: [StudioCrudApplication],
})
export class StudioModule {}
