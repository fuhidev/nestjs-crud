import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1698863608901 implements MigrationInterface {
  name = 'Migration1698863608901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Product" ADD "shape" geometry`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "shape"`);
  }
}
