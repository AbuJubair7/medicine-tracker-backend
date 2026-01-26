import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastDeductedAt1769445728570 implements MigrationInterface {
    name = 'AddLastDeductedAt1769445728570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ADD "lastDeductedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "lastDeductedAt"`);
    }

}
