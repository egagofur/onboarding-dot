import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IStudio } from 'interface-models/movie/studio.interface';

export const createStudio = (studio: IStudio): void => {
    Inertia.post(Route.StudiosCreate, studio as unknown as FormData);
};

export const updateStudio = (id: number, studio: IStudio): void => {
    Inertia.put(
        route(Route.StudiosEdit, { id }),
        studio as unknown as FormData,
    );
};

export const deleteStudio = (id: number): void => {
    Inertia.delete(route(Route.StudiosDelete, { id }));
};
