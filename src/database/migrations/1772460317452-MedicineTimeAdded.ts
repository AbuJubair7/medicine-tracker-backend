import { MigrationInterface, QueryRunner } from "typeorm";

export class MedicineTimeAdded1772460317452 implements MigrationInterface {
    name = 'MedicineTimeAdded1772460317452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ADD "morningTime" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD "afternoonTime" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD "eveningTime" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "eveningTime"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "afternoonTime"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "morningTime"`);
    }

}
