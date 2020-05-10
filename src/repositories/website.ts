import { getConnection, getManager } from 'typeorm'

import { Website } from '../entities/Website'

const getWebsiteUrls = async (name: string): Promise<string[]> => {
  const repository = getManager().getRepository(Website)
  const websites = await repository.find({
    where: { name },
  })

  return websites.map(({ url }) => url)
}

export const retrieveWebsiteUrls = async (
  name: string,
  limit: number = 25,
  offset: number = 0,
) => {
  const repository = getManager().getRepository(Website)
  const websites = await repository.find({
    where: { name },
    take: limit,
    skip: offset,
  })

  return websites.map(({ url }) => url)
}

export const addUniqueUrls = async (name: string, urls: string[]) => {
  const currentUrls = await getWebsiteUrls(name)
  const newUrls = urls
    .filter((url: string) => !currentUrls.includes(url))
    .map((url) => ({ name, url }))

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Website)
    .values(newUrls)
    .execute()
}
