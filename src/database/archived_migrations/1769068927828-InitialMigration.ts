import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1769068927828 implements MigrationInterface {
    name = 'InitialMigration1769068927828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
