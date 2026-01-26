import { MigrationInterface, QueryRunner } from "typeorm";

export class DeployInit1769419957484 implements MigrationInterface {
    name = 'DeployInit1769419957484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medicines" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "dose" double precision NOT NULL, "quantity" integer NOT NULL, "takeMorning" boolean NOT NULL DEFAULT true, "takeAfternoon" boolean NOT NULL DEFAULT true, "takeEvening" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "stockId" integer, CONSTRAINT "PK_77b93851766f7ab93f71f44b18b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stocks" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255), "googleId" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medicines" ADD CONSTRAINT "FK_9dbbd4d145d58faef50c9aad29d" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_bb048332e799d2fd650ca613e5a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_bb048332e799d2fd650ca613e5a"`);
        await queryRunner.query(`ALTER TABLE "medicines" DROP CONSTRAINT "FK_9dbbd4d145d58faef50c9aad29d"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "stocks"`);
        await queryRunner.query(`DROP TABLE "medicines"`);
    }

}
