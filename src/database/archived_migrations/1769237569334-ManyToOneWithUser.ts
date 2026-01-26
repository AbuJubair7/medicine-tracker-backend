import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyToOneWithUser1769237569334 implements MigrationInterface {
    name = 'ManyToOneWithUser1769237569334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_bb048332e799d2fd650ca613e5a"`);
        await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "REL_bb048332e799d2fd650ca613e5"`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_bb048332e799d2fd650ca613e5a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_bb048332e799d2fd650ca613e5a"`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "REL_bb048332e799d2fd650ca613e5" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_bb048332e799d2fd650ca613e5a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
