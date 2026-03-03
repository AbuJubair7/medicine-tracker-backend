import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTimeAdded1772475108815 implements MigrationInterface {
    name = 'DefaultTimeAdded1772475108815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ADD "morningTime" integer NOT NULL DEFAULT '9'`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD "afternoonTime" integer NOT NULL DEFAULT '14'`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD "eveningTime" integer NOT NULL DEFAULT '21'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "eveningTime"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "afternoonTime"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "morningTime"`);
    }

}
