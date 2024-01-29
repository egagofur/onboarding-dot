import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'entities/movie/tag.entity';
import { TagService } from './services/tag.service';
import { TagCrudApplication } from './applications/tag-crud.application';
import { TagController } from './controllers/tag.controller';
import { InertiaAdapter } from '../../infrastructure/inertia/adapter/inertia.adapter';
import { TagIndexApplication } from './applications/tag-index.application';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [
        TagService,
        TagCrudApplication,
        InertiaAdapter,
        TagIndexApplication,
    ],
    controllers: [TagController],
    exports: [TagCrudApplication, TagService],
})
export class TagModule {}
