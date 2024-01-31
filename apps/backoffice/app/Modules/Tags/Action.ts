import { Inertia, RequestPayload } from '@inertiajs/inertia';
import { Route, route } from '../../Common/Route/Route';
import { ITags } from './Entities';

export const createTags = (tags: ITags & RequestPayload) => {
    Inertia.post(Route.TagsCreate, tags);
};

export const updateTags = (id: number, tags: ITags & RequestPayload) => {
    Inertia.put(route(Route.TagsEdit, { id }), tags);
};

export const deleteTags = (id: number) => {
    Inertia.delete(route(Route.TagsDelete, { id }));
};
