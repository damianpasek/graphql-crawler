import { addUniqueUrls } from '../repositories/website'
import { getPageUrls } from '../crawler/PageCrawler'

export const crawlWebsite = async (url: string): Promise<string[]> => {
  const urls = await getPageUrls(url)
  await addUniqueUrls(url, urls)
  return urls
}
