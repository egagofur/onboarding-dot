import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from 'entities/iam/role.entity';
import { UserRole } from 'entities/iam/user-role.entity';
import { User } from 'entities/iam/user.entity';

export class CreateUserRoleSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const results = [];

        const role = await connection
            .createQueryBuilder(Role, 'roles')
            .where({
                key: 'admin',
            })
            .getOne();

        const user = await connection
            .createQueryBuilder(User, 'users')
            .where({
                fullname: 'admin',
            })
            .getOne();

        results.push(
            Object.assign(new UserRole(), {
                user: user,
                role: role,
            }),
        );

        await connection
            .createQueryBuilder()
            .insert()
            .into(UserRole)
            .values(results)
            .execute();
    }
}
