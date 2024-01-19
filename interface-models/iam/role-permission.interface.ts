import { IBaseEntity } from 'interface-models/base-entity.interface';
import { IPermission } from './permission.interface';
import { IRole } from './role.interface';

export interface IRolePermission extends IBaseEntity {
    id: number;

    role: IRole;

    permission: IPermission;
}
