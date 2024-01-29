import { Module } from '@nestjs/common';
import { MovieTagService } from './services/movie-tag.service';
import { MovieTagController } from './controllers/movie-tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieTags } from 'entities/movie/movie-tags.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MovieTags])],
    providers: [MovieTagService],
    controllers: [MovieTagController],
    exports: [MovieTagService],
})
export class MovieTagModule {}
