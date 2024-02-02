import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IMovie } from 'interface-models/movie/movie.interface';

export const updateMovie = async (id: number, data: IMovie) => {
    Inertia.patch(route(Route.MovieEdit, { id }), data as unknown as FormData);
};

export const createMovie = (data: IMovie) => {
    new Promise((resolve, reject) => {
        Inertia.post(Route.MovieCreate, data as unknown as FormData, {
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
