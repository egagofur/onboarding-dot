import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovieTables1705752351392 implements MigrationInterface {
    name = 'CreateMovieTables1705752351392';

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            `CREATE TABLE \`orders\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`paymentMethod\` enum ('Cash', 'CreditCard', 'DebitCard', 'Paypal', 'Other') NOT NULL DEFAULT 'Cash', \`totalItemsPrice\` int NOT NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`order_items\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`qty\` int NOT NULL, \`price\` int NOT NULL, \`sub_total_price\` int NOT NULL, \`snap_shot\` varchar(255) NOT NULL, \`order_id\` int NULL, \`movie_schedule_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
        await queryRunner.query(
            `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_1c385103935dd0007b77467b2cc\` FOREIGN KEY (\`movie_schedule_id\`) REFERENCES \`movie_schedules\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_1c385103935dd0007b77467b2cc\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``,
        );
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
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3a3ba47b7ca00fd23be4ebd6cf\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_3d0a7155eafd75ddba5a7013368\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_32a6fc2fcb019d8e3a8ace0f55f\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_3d0a7155eafd75ddba5a701336\` ON \`role_permission\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_e3a3ba47b7ca00fd23be4ebd6c\` ON \`role_permission\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`user_id\` \`user_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`role_id\` \`role_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`permission_id\` \`permission_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`role_id\` \`role_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`permission_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`role_id\` \`role_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`permission_id\` \`permission_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`user_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`role_id\` \`role_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`user_id\` \`user_id\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`permission_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`role_id\`, \`permission_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`user_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`role_id\`, \`user_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`role_id\`, \`user_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`role_id\`, \`permission_id\`, \`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP COLUMN \`id\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP COLUMN \`deleted_at\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP COLUMN \`updated_at\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP COLUMN \`created_at\``,
        );
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP COLUMN \`id\``);
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP COLUMN \`deleted_at\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP COLUMN \`updated_at\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP COLUMN \`created_at\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD PRIMARY KEY (\`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD \`deleted_at\` datetime(6) NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD \`deleted_at\` datetime(6) NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`movie_tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`movie_schedules\``);
        await queryRunner.query(`DROP TABLE \`movies\``);
        await queryRunner.query(`DROP TABLE \`studios\``);
        await queryRunner.query(
            `CREATE INDEX \`IDX_e3a3ba47b7ca00fd23be4ebd6c\` ON \`role_permission\` (\`permission_id\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_3d0a7155eafd75ddba5a701336\` ON \`role_permission\` (\`role_id\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`log_activity_menu\` ON \`log_activities\` (\`menu\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`log_activity_activity\` ON \`log_activities\` (\`activity\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3a3ba47b7ca00fd23be4ebd6cf\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_3d0a7155eafd75ddba5a7013368\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_32a6fc2fcb019d8e3a8ace0f55f\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }
}
