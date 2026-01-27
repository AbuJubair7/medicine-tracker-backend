import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexingAdded1769501677055 implements MigrationInterface {
    name = 'IndexingAdded1769501677055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9dbbd4d145d58faef50c9aad29" ON "medicines" ("stockId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a2f9a3c7dce491e9e2740254d" ON "stocks" ("userId", "id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8a2f9a3c7dce491e9e2740254d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9dbbd4d145d58faef50c9aad29"`);
    }

}
