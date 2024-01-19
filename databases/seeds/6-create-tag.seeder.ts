import { Tags } from 'entities/movie/tags.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class CreateTagSeeder implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const { data } = require('../dummies/tag.json');
        const datax = await connection.getRepository(Tags).find();
        if (datax.length <= 0) {
            for (let i = 0; i < data.length; i++) {
                const tag = connection.getRepository(Tags).create();

                tag.name = data[i].name;

                try {
                    await connection.getRepository(Tags).save(tag);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}
