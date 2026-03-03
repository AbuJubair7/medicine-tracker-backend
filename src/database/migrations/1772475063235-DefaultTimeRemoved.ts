import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTimeRemoved1772475063235 implements MigrationInterface {
    name = 'DefaultTimeRemoved1772475063235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "morningTime"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "afternoonTime"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "eveningTime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ADD "eveningTime" integer NOT NULL DEFAULT '21'`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD "afternoonTime" integer NOT NULL DEFAULT '14'`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD "morningTime" integer NOT NULL DEFAULT '9'`);
    }

}
