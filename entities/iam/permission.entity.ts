import {
    AfterInsert,
    AfterUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IPermission } from 'interface-models/iam/permission.interface';
import { BaseEntity } from 'entities/base.entity';
import { IRole } from 'interface-models/iam/role.interface';
import { Role } from './role.entity';
import { LogActivityMenuEnum } from 'apps/backoffice/src/common/enums/log-activity.enum';
import { GlobalService } from 'apps/backoffice/src/modules/glob/service/global-service.service';
import { LogActivityDto } from 'entities/log-activity/dto/log-activity.dto';

@Entity({ name: 'permission' })
export class Permission extends BaseEntity implements IPermission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    key: string;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'role_permission',
        joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: IRole[];

    @AfterUpdate()
    async createLogActivityUpdate() {
        const logActivity: LogActivityDto = {
            menu: LogActivityMenuEnum.PERMISSION,
            path: __filename,
            user: null, // get user from jwt
            meta_data: this,
            source: this.id.toString(),
            activity: 'Update permission',
        };

        GlobalService.createLogActivity(logActivity);
    }

    @AfterInsert()
    async createLogActivityInsert() {
        const logActivity: LogActivityDto = {
            menu: LogActivityMenuEnum.PERMISSION,
            path: __filename,
            user: null, // get user from jwt
            meta_data: this,
            source: this.id.toString(),
            activity: 'Create new permission',
        };

        GlobalService.createLogActivity(logActivity);
    }
}
