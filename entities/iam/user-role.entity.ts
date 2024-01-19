import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IRole } from 'interface-models/iam/role.interface';
import { Role } from './role.entity';
import { BaseEntity } from 'entities/base.entity';
import { IUserRole } from 'interface-models/iam/user-role.interface';
import { User } from './user.entity';
import { IUser } from 'interface-models/iam/user.interface';

@Entity({ name: 'user_role' })
export class UserRole extends BaseEntity implements IUserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: IRole;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: IUser;
}
