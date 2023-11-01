import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698855835436 implements MigrationInterface {
    name = 'Migration1698855835436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "District" ("districtId" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "numbering" int NOT NULL CONSTRAINT "DF_fb4f8ca126e1161c6c94193ab74" DEFAULT 0, CONSTRAINT "PK_5cfdedf036a578ff9a10889f5c1" PRIMARY KEY ("districtId"))`);
        await queryRunner.query(`CREATE TABLE "Agency" ("agencyId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, CONSTRAINT "PK_7c07a053ca6b3deb52ecc8c60af" PRIMARY KEY ("agencyId"))`);
        await queryRunner.query(`CREATE TABLE "Product" ("productId" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "avatarId" nvarchar(255), "address" nvarchar(255), "price" money NOT NULL CONSTRAINT "DF_8e992b54c626bd00f06e4d109c0" DEFAULT '$0.00', "area" int NOT NULL CONSTRAINT "DF_540f2f55025611e797968e0e08f" DEFAULT 0, "bedNum" int, "bathNum" int, "description" nvarchar(255) NOT NULL, "createDate" datetime2 NOT NULL CONSTRAINT "DF_46d1c4d9389518ed221748d47f8" DEFAULT getdate(), "updateDate" datetime2 NOT NULL CONSTRAINT "DF_f44addc094501eb43056b48e37f" DEFAULT getdate(), "trending" bit NOT NULL CONSTRAINT "DF_6a6de10fc321c2a7e57d3dd7287" DEFAULT 0, "agencyId" int, "priceTo" money, "areaTo" int, "roomNum" int, "districtId" nvarchar(255), "location" nvarchar(255), CONSTRAINT "PK_997722a72629b31636aadbdd789" PRIMARY KEY ("productId"))`);
        await queryRunner.query(`CREATE TABLE "Post" ("postId" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL CONSTRAINT "DF_1c5064f2277effc6aa4230d570d" DEFAULT '', "shortDescription" nvarchar(255) NOT NULL CONSTRAINT "DF_217836af3716547219a722f55d7" DEFAULT '', "createDate" datetime2 NOT NULL CONSTRAINT "DF_782b3d7df4ccf873be50d03a3f6" DEFAULT getdate(), "updateDate" datetime2 NOT NULL CONSTRAINT "DF_b13320c18f39589629f9e3cf17b" DEFAULT getdate(), CONSTRAINT "PK_1b87a8baae2a0796606c736a222" PRIMARY KEY ("postId"))`);
        await queryRunner.query(`CREATE TABLE "Legal" ("legalId" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL CONSTRAINT "DF_e418680343a78dd5b20e8074974" DEFAULT '', "description" nvarchar(255) NOT NULL CONSTRAINT "DF_827f871d932e443ded7d082d6ac" DEFAULT '', CONSTRAINT "PK_b7ca73b7b2a5bee0ad0991e8a53" PRIMARY KEY ("legalId"))`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_4239d6bd80476a293baa996ac4c" FOREIGN KEY ("agencyId") REFERENCES "Agency"("agencyId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_618967e6566ec9ae20e34e159f7" FOREIGN KEY ("districtId") REFERENCES "District"("districtId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_618967e6566ec9ae20e34e159f7"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_4239d6bd80476a293baa996ac4c"`);
        await queryRunner.query(`DROP TABLE "Legal"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`DROP TABLE "Product"`);
        await queryRunner.query(`DROP TABLE "Agency"`);
        await queryRunner.query(`DROP TABLE "District"`);
    }

}
