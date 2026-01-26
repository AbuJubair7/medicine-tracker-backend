import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumAdded1769069263388 implements MigrationInterface {
    name = 'UpdateColumAdded1769069263388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

}
