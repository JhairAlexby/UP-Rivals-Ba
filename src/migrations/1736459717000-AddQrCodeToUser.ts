import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQrCodeToUser1736459717000 implements MigrationInterface {
    name = 'AddQrCodeToUser1736459717000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "qrCode" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_user_qrCode" UNIQUE ("qrCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_user_qrCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "qrCode"`);
    }
}