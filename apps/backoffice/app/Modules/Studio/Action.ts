import { Inertia, RequestPayload } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { IStudio } from 'interface-models/movie/studio.interface';

export const createStudio = async (studio: IStudio & RequestPayload) => {
    Inertia.post(Route.StudiosCreate, studio);
};

export const updateStudio = async (
    id: number,
    studio: IStudio & RequestPayload,
) => {
    Inertia.put(route(Route.StudiosEdit, { id }), studio);
};

export const deleteStudio = async (id: number) => {
    Inertia.delete(route(Route.StudiosDelete, { id }));
};
