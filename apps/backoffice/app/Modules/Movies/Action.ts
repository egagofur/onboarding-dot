import { Inertia, RequestPayload } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IMovie } from 'interface-models/movie/movie.interface';

export const updateMovie = async (
    id: number,
    data: IMovie & RequestPayload,
) => {
    Inertia.patch(route(Route.MovieEdit, { id }), data);
};

export const createMovie = (data: IMovie & RequestPayload) => {
    new Promise((resolve, reject) => {
        Inertia.post(Route.MovieCreate, data, {
            onSuccess: (success) => {
                resolve(success);
            },
            onError: (error) => {
                reject(error);
            },
        });
    });
};

export const deleteMovie = (id: number) => {
    Inertia.delete(route(Route.MovieDelete, { id: id }));
};

export const uploadFile = (data: string) => {
    Inertia.post(Route.UploadPhoto, { data });
};
