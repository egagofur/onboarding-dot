import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';

export const createMovieSchedule = (data: IMovieSchedule) => {
    Inertia.post(Route.MovieSchedulesCreate, data as unknown as FormData);
};

export const updateMovieSchedule = (id: number, data: IMovieSchedule) => {
    Inertia.put(
        route(Route.MovieSchedulesEdit, { id }),
        data as unknown as FormData,
    );
};

export const deleteMovieSchedule = (id: number) => {
    Inertia.delete(route(Route.MovieSchedulesDelete, { id }));
};
