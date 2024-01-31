import { Inertia, RequestPayload } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';

export const createMovieSchedule = (data: IMovieSchedule & RequestPayload) => {
    Inertia.post(Route.MovieSchedulesCreate, data);
};

export const updateMovieSchedule = (
    id: number,
    data: IMovieSchedule & RequestPayload,
) => {
    Inertia.put(route(Route.MovieSchedulesEdit, { id }), data);
};

export const deleteMovieSchedule = (id: number) => {
    Inertia.delete(route(Route.MovieSchedulesDelete, { id }));
};
