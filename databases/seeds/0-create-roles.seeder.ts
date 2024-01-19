import { Role } from 'entities/iam/role.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class CreateRoleSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const { data } = require('../dummies/roles.json');
        const datax = await connection.getRepository(Role).find();
        if (datax.length <= 0) {
            for (let i = 0; i < data.length; i++) {
                const role = connection.getRepository(Role).create();

                role.name = data[i];
                role.key = data[i];

                await connection.getRepository(Role).save(role);
            }
        }
    }
}
