import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovieOrderTables1705594295526 implements MigrationInterface {
    name = 'MovieOrderTables1705594295526';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`configs\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_03f58fb0f3cccd983dded221bf\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`studios\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`studio_number\` int NOT NULL, \`seat_capacity\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`movies\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`overview\` varchar(255) NOT NULL, \`poster\` varchar(255) NOT NULL, \`play_until\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`movie_schedules\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`start_time\` datetime NOT NULL, \`end_time\` datetime NOT NULL, \`price\` int NOT NULL, \`date\` datetime NOT NULL, \`movie_id\` int NULL, \`studio_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`tags\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`movie_tags\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`movie_id\` int NULL, \`tags_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`otps\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`trial\` int NOT NULL, \`is_valid\` tinyint NOT NULL DEFAULT 0, \`expired_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_1bc9ff80ec0964c8550025acaf7\` FOREIGN KEY (\`movie_id\`) REFERENCES \`movies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_e5631fdeeee0b9cbf449b459e39\` FOREIGN KEY (\`studio_id\`) REFERENCES \`studios\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_tags\` ADD CONSTRAINT \`FK_da8c59e083499f43b357ec2ed4c\` FOREIGN KEY (\`movie_id\`) REFERENCES \`movies\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_tags\` ADD CONSTRAINT \`FK_9edbecf50ac309b4d99aa530bb7\` FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`movie_tags\` DROP FOREIGN KEY \`FK_9edbecf50ac309b4d99aa530bb7\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_tags\` DROP FOREIGN KEY \`FK_da8c59e083499f43b357ec2ed4c\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_e5631fdeeee0b9cbf449b459e39\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_1bc9ff80ec0964c8550025acaf7\``,
        );
        await queryRunner.query(`DROP TABLE \`otps\``);
        await queryRunner.query(`DROP TABLE \`movie_tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`movie_schedules\``);
        await queryRunner.query(`DROP TABLE \`movies\``);
        await queryRunner.query(`DROP TABLE \`studios\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_03f58fb0f3cccd983dded221bf\` ON \`configs\``,
        );
        await queryRunner.query(`DROP TABLE \`configs\``);
    }
}
