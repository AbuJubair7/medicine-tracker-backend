import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedNewTable1769149037080 implements MigrationInterface {
    name = 'CreatedNewTable1769149037080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medicines" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "dose" double precision NOT NULL, "quantity" integer NOT NULL, "takeMorning" boolean NOT NULL DEFAULT true, "takeAfternoon" boolean NOT NULL DEFAULT true, "takeEvening" boolean NOT NULL DEFAULT true, "stockId" integer, CONSTRAINT "PK_77b93851766f7ab93f71f44b18b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stocks" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "userId" integer, CONSTRAINT "REL_bb048332e799d2fd650ca613e5" UNIQUE ("userId"), CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD CONSTRAINT "FK_9dbbd4d145d58faef50c9aad29d" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_bb048332e799d2fd650ca613e5a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_bb048332e799d2fd650ca613e5a"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP CONSTRAINT "FK_9dbbd4d145d58faef50c9aad29d"`);
        await queryRunner.query(`DROP TABLE "stocks"`);
        await queryRunner.query(`DROP TABLE "medicines"`);
    }

}
