import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTable1656301180717 implements MigrationInterface {
    name = 'InitTable1656301180717';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`configs\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_03f58fb0f3cccd983dded221bf\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`roles\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_a87cf0659c3ac379b339acf36a\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`permission\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_20ff45fefbd3a7c04d2572c3bb\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`role_permission\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`role_id\` int NULL, \`permission_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`users\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`fullname\` varchar(255) NOT NULL, \`identity_number\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`email_verified_at\` datetime NULL, \`one_signal_player_ids\` json NULL, \`phone_verified_at\` datetime NULL, \`email\` varchar(255) NULL, \`birth_date\` datetime NULL, \`gender\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_43d2ef62e309fe8f4bae2a67e5\` (\`identity_number\`), UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`in_app_notifications\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`target_user_id\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` varchar(255) NOT NULL, \`meta\` json NULL, \`is_read\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`otps\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`trial\` int NOT NULL, \`is_valid\` tinyint NOT NULL DEFAULT 0, \`expired_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`log_activities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meta_data\` json NULL, \`source\` varchar(255) NULL, \`activity\` varchar(255) NOT NULL, \`menu\` varchar(255) NULL, \`path\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_role\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`role_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_3d0a7155eafd75ddba5a701336\` ON \`role_permission\` (\`role_id\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_e3a3ba47b7ca00fd23be4ebd6c\` ON \`role_permission\` (\`permission_id\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_3d0a7155eafd75ddba5a7013368\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3a3ba47b7ca00fd23be4ebd6cf\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`in_app_notifications\` ADD CONSTRAINT \`FK_046713440a98830b619c4c649b4\` FOREIGN KEY (\`target_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`log_activities\` ADD CONSTRAINT \`FK_4357a91cbef922677d73d510f70\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `CREATE INDEX \`log_activity_menu\` ON \`log_activities\` (\`menu\`) USING BTREE`,
        );
        await queryRunner.query(
            `CREATE INDEX \`log_activity_activity\` ON \`log_activities\` (\`activity\`) USING BTREE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_32a6fc2fcb019d8e3a8ace0f55f\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_32a6fc2fcb019d8e3a8ace0f55f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`log_activities\` DROP FOREIGN KEY \`FK_4357a91cbef922677d73d510f70\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`in_app_notifications\` DROP FOREIGN KEY \`FK_046713440a98830b619c4c649b4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3a3ba47b7ca00fd23be4ebd6cf\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_3d0a7155eafd75ddba5a7013368\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``,
        );
        await queryRunner.query(`DROP TABLE \`user_role\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_e3a3ba47b7ca00fd23be4ebd6c\` ON \`role_permission\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_3d0a7155eafd75ddba5a701336\` ON \`role_permission\``,
        );
        await queryRunner.query(`DROP TABLE \`otps\``);
        await queryRunner.query(`DROP TABLE \`in_app_notifications\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_43d2ef62e309fe8f4bae2a67e5\` ON \`users\``,
        );
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`role_permission\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_20ff45fefbd3a7c04d2572c3bb\` ON \`permission\``,
        );
        await queryRunner.query(`DROP TABLE \`permission\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_a87cf0659c3ac379b339acf36a\` ON \`roles\``,
        );
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_03f58fb0f3cccd983dded221bf\` ON \`configs\``,
        );
        await queryRunner.query(`DROP TABLE \`configs\``);
        await queryRunner.query(`DROP TABLE \`log_activities\``);
        await queryRunner.query(
            `DROP INDEX \`log_activity_menu\` ON \`log_activities\``,
        );
        await queryRunner.query(
            `DROP INDEX \`log_activity_activity\` ON \`log_activities\``,
        );
    }
}
