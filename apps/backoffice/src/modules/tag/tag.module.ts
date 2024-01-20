import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'entities/movie/tag.entity';
import { TagService } from './services/tag.service';
import { TagCrudApplication } from './applications/tag-crud.application';
import { TagController } from './controllers/tag.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [TagService, TagCrudApplication],
    controllers: [TagController],
    exports: [TagCrudApplication],
})
export class TagModule {}
