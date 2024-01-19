import { Injectable } from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';

@Injectable()
export class ScheduleCrudApplication {
    constructor(private readonly scheduleService: ScheduleService) {}

    async addNewSchedule(data: IMovieSchedule): Promise<any> {
        const results = await this.scheduleService.addSchedule(data);
        return results;
    }

    async getNowPlaying(): Promise<any> {
        const results = await this.scheduleService.getNowPlaying();
        return results;
    }
}
