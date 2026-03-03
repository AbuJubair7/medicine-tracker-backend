import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTimeAdded1772472919648 implements MigrationInterface {
    name = 'DefaultTimeAdded1772472919648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ALTER COLUMN "morningTime" SET DEFAULT '9'`);
        await queryRunner.query(`ALTER TABLE "medicines" ALTER COLUMN "afternoonTime" SET DEFAULT '14'`);
        await queryRunner.query(`ALTER TABLE "medicines" ALTER COLUMN "eveningTime" SET DEFAULT '21'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ALTER COLUMN "eveningTime" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "medicines" ALTER COLUMN "afternoonTime" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "medicines" ALTER COLUMN "morningTime" SET DEFAULT '0'`);
    }

}
