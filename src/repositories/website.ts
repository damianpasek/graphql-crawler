import { getConnection, getManager } from 'typeorm'

import { Website } from '../entities/Website'

export const retrieveWebsiteUrls = async (
  name: string,
  limit?: number,
  offset?: number,
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
  const currentUrls = await retrieveWebsiteUrls(name)
  const payload = urls
    .filter((url: string) => !currentUrls.includes(url))
    .map((url) => ({ name, url }))

  if (payload.length) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Website)
      .values(payload)
      .execute()
  }
}
