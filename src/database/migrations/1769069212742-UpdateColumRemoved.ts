import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumRemoved1769069212742 implements MigrationInterface {
    name = 'UpdateColumRemoved1769069212742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
