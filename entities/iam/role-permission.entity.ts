import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IRolePermission } from 'interface-models/iam/role-permission.interface';
import { IPermission } from 'interface-models/iam/permission.interface';
import { IRole } from 'interface-models/iam/role.interface';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { BaseEntity } from 'entities/base.entity';

@Entity({ name: 'role_permission' })
export class RolePermission extends BaseEntity implements IRolePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: IRole;

    @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: IPermission;
}
