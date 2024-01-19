import { Body, Controller, Get, Post } from '@nestjs/common';
import { InertiaAdapter } from 'apps/backoffice/src/infrastructure/inertia/adapter/inertia.adapter';
import { ScheduleCrudApplication } from '../applications/schedule-crud.application';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { ScheduleMapper } from '../mappers/schedule.mapper';

@Controller('schedules')
export class ScheduleController {
    constructor(
        private readonly inertiaAdapter: InertiaAdapter,
        private readonly scheduleCrudApplication: ScheduleCrudApplication,
    ) {}

    @Get('now-playing')
    async indexPage(): Promise<void> {
        const props = await this.scheduleCrudApplication.getNowPlaying();
        return this.inertiaAdapter.render({
            component: 'Schedule/NowPlaying',
            props: {
                ...props,
                data: props.data.map((schedule) =>
                    ScheduleMapper.fromEntity(schedule),
                ),
            },
        });
    }

    @Post('add-new-schedule')
    async addNewSchedule(@Body() data: IMovieSchedule): Promise<void> {
        const props = await this.scheduleCrudApplication.addNewSchedule(data);
        return this.inertiaAdapter.render({
            component: 'Schedule/AddNewSchedule',
            props: {
                ...props,
                data: props.data.map((schedule) =>
                    ScheduleMapper.fromEntity(schedule),
                ),
            },
        });
    }
}
