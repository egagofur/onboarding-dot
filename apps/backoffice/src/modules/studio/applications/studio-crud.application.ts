import { Injectable } from '@nestjs/common';
import { StudioService } from '../services/studio.service';

@Injectable()
export class StudioCrudApplication {
    constructor(private readonly studioService: StudioService) {}
}
