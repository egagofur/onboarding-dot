import { Injectable } from '@nestjs/common';
import { ILogActivity } from 'interface-models/log-activity/log-activity.interface';
import { LogActivityService } from '../services/log-activity.service';

@Injectable()
export class LogActivityCrudApplication {
    constructor(private readonly logActivityService: LogActivityService) {}

    async findOneById(id: number): Promise<ILogActivity> {
        return await this.logActivityService.findOneById(id);
    }
}
