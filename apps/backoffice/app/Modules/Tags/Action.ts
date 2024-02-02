import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { ITags } from './Entities';

export const createTags = (tags: ITags): void => {
    Inertia.post(Route.TagsCreate, tags as unknown as FormData);
};

export const updateTags = (id: number, tags: ITags): void => {
    Inertia.put(route(Route.TagsEdit, { id }), tags as unknown as FormData);
};

export const deleteTags = (id: number): void => {
    Inertia.delete(route(Route.TagsDelete, { id }));
};
