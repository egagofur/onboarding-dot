import { Inertia } from '@inertiajs/inertia';
import { Route } from 'apps/backoffice/app/Common/Route/Route';

export const doRegister = (registerData) => {
    Inertia.post(Route.AuthRegister, registerData, {
        onSuccess: (success) => {
            return success;
        },
        onError: (error) => {
            console.log('Error: ', error);
        },
    });
};
