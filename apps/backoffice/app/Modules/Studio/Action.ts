import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';

export const createStudio = async (studio) => {
    Inertia.post(Route.StudiosCreate, studio);
};

export const updateStudio = async (id: number, studio) => {
    Inertia.put(route(Route.StudiosEdit, { id }), studio);
};

export const deleteStudio = async (id: number) => {
    Inertia.delete(route(Route.StudiosDelete, { id }));
};
