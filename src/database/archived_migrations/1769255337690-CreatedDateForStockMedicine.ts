import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedDateForStockMedicine1769255337690 implements MigrationInterface {
    name = 'CreatedDateForStockMedicine1769255337690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicines" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stocks" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP COLUMN "createdAt"`);
    }

}
