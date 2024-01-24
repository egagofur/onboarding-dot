import { Inertia } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';

export const createTags = (tags) => {
    Inertia.post(Route.TagsCreate, tags);
};

export const updateTags = (id, tags) => {
    Inertia.put(route(Route.TagsEdit, { id }), tags);
};

export const deleteTags = (id) => {
    Inertia.delete(route(Route.TagsDelete, { id }));
};
