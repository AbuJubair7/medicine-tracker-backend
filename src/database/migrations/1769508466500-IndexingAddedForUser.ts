import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexingAddedForUser1769508466500 implements MigrationInterface {
    name = 'IndexingAddedForUser1769508466500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9dbbd4d145d58faef50c9aad29"`);
        await queryRunner.query(`CREATE INDEX "stock_idx" ON "medicines" ("stockId") `);
        await queryRunner.query(`CREATE INDEX "id_idx" ON "users" ("id") `);
        await queryRunner.query(`CREATE INDEX "email_idx" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."email_idx"`);
        await queryRunner.query(`DROP INDEX "public"."id_idx"`);
        await queryRunner.query(`DROP INDEX "public"."stock_idx"`);
        await queryRunner.query(`CREATE INDEX "IDX_9dbbd4d145d58faef50c9aad29" ON "medicines" ("stockId") `);
    }

}
