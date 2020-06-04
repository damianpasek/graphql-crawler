/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class websites1589104562545 implements MigrationInterface {
  name = 'websites1589104562545'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `website` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `website`', undefined)
  }
}
