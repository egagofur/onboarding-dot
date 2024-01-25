import { Inertia, RequestPayload } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';

export const createMovieSchedule = (data: IMovieSchedule) => {
    Inertia.post(
        Route.MovieSchedulesCreate,
        data as RequestPayload & IMovieSchedule,
    );
};

export const updateMovieSchedule = (id, data) => {
    Inertia.put(route(Route.MovieSchedulesEdit, { id }), data);
};

export const deleteMovieSchedule = (id) => {
    Inertia.delete(route(Route.MovieSchedulesDelete, { id }));
};
