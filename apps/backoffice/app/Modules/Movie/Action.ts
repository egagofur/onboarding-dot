import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';

export class MovieService {
    updateMovie(id: number, data) {
        new Promise((resolve, reject) => {
            Inertia.put(route(Route.MovieEdit, { id }), data, {
                onSuccess: (success) => {
                    resolve(success);
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    }

    createMovie(data: any) {
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
    }

    deleteMovie(id: number) {
        new Promise((resolve, reject) => {
            Inertia.post(
                route(Route.MovieDelete, { id }),
                {},
                {
                    onSuccess: (success) => {
                        resolve(success);
                    },
                    onError: (error) => {
                        reject(error);
                    },
                },
            );
        });
    }
}
