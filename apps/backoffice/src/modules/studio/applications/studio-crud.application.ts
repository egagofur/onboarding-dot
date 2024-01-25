import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { StudioService } from '../services/studio.service';
import { IStudio } from 'interface-models/movie/studio.interface';

@Injectable()
export class StudioCrudApplication {
    constructor(private readonly studioService: StudioService) {}

    async create(studioRequest: IStudio): Promise<IStudio> {
        const isStudioExist = await this.studioService.isStudioExist(
            studioRequest.studioNumber,
        );

        if (isStudioExist) {
            throw new UnprocessableEntityException(
                `Studio ${studioRequest.studioNumber} has already exists`,
            );
        }

        return await this.studioService.create(studioRequest);
    }

    async update(id: number, studioRequest: IStudio): Promise<IStudio> {
        const isStudioExist = await this.studioService.isStudioExist(
            studioRequest.studioNumber,
        );

        if (isStudioExist) {
            throw new UnprocessableEntityException(
                `Studio ${studioRequest.studioNumber} has already exists`,
            );
        }

        return await this.studioService.update(id, studioRequest);
    }

    async delete(id: number): Promise<void> {
        await this.studioService.delete(id);
    }

    async findAll(): Promise<IStudio[]> {
        return await this.studioService.findAll();
    }

    async findOneById(id: number): Promise<IStudio> {
        return await this.studioService.findOneById(id);
    }
}
