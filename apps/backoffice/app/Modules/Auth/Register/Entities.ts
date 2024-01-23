import { UserCreateRequest } from 'apps/backoffice/src/modules/iam/requests/user-create.request';

export type TRegister = Omit<UserCreateRequest, 'roles'>;
