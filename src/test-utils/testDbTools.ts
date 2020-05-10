import { getConnection, getManager } from 'typeorm'

export const batchAddRecords = async (entity: any, records: any[]) => getConnection()
  .createQueryBuilder()
  .insert()
  .into(entity)
  .values(records)
  .execute()

export const getRecords = async (entity: any, where: object = {}) => getManager()
  .getRepository(entity)
  .find(where)
