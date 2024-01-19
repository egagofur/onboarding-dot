import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Studio } from 'entities/movie/studio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudioService {
    constructor(
        @InjectRepository(Studio)
        private readonly movieRepository: Repository<Studio>,
    ) {}

    async addStudio(addNewStudioDto) {
        const newStudio = await this.movieRepository.create({
            studioNumber: addNewStudioDto.studio_number,
            seatCapacity: addNewStudioDto.seat_capacity,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.movieRepository.save(newStudio);

        return newStudio;
    }
}
