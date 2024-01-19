import { Module } from '@nestjs/common';
import { StudioService } from './services/studio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studio } from 'entities/movie/studio.entity';
import { StudioController } from './controller/studio.controller';
import { StudioCrudApplication } from './applications/studio-crud.application';

@Module({
    imports: [TypeOrmModule.forFeature([Studio])],
    providers: [StudioService],
    controllers: [StudioController],
    exports: [StudioCrudApplication],
})
export class StudioModule {}