import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Config } from 'entities/config/config.entity';

export class CreateConfigSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const { data } = require('../dummies/config.json');

        const datax = await connection.getRepository(Config).find();
        if (datax.length <= 0) {
            for (let i = 0; i < data.length; i++) {
                const newConfig = connection.getRepository(Config).create();

                newConfig.name = data[i].name;
                newConfig.value = data[i].value;
                newConfig.key = data[i].key;

                await connection.getRepository(Config).save(newConfig);
            }
        }
    }
}
