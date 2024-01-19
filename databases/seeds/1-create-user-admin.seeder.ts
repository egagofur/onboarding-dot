import { User } from 'entities/iam/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from 'entities/iam/role.entity';
import { Utils } from 'apps/backoffice/src/common/utils/util';

export class CreateUserAdminSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const results = [];

        const { data } = require('../dummies/admin.json');

        const datax = await connection.getRepository(User).find();
        if (datax.length <= 0) {
            const role = await connection
                .createQueryBuilder(Role, 'roles')
                .where({
                    key: 'admin',
                })
                .getOne();

            for (let i = 0; i < data.length; i++) {
                results.push(
                    Object.assign(new User(), {
                        fullname: data[i].fullname,
                        email: data[i].email,
                        password: await Utils.bcryptHash(data[i].password),
                        identityNumber: data[i].identityNumber,
                        phoneNumber: data[i].phoneNumber,
                        role: [role],
                        gender: data[i].gender,
                    }),
                );

                await connection
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values(results)
                    .execute();
            }
        }
    }
}
