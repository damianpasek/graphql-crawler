import * as websiteRepository from '../../repositories/website'
import * as pageCrawler from '../../crawler/PageCrawler'
import { crawlWebsite } from '../crawler'

describe('Utils: crawler', () => {
  describe('crawlWebsite', () => {
    const MOCKED_URL = 'http://example.com'
    const MOCKED_URLS = ['https://example.website']

    beforeEach(() => {
      jest.spyOn(websiteRepository, 'addUniqueUrls').mockResolvedValue(undefined)
      jest.spyOn(pageCrawler, 'getPageUrls').mockResolvedValue(MOCKED_URLS)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should run crawler, save in the database and then return urls', async () => {
      const result = await crawlWebsite(MOCKED_URL)

      expect(result).toEqual(MOCKED_URLS)
      expect(websiteRepository.addUniqueUrls).toHaveBeenLastCalledWith(MOCKED_URL, MOCKED_URLS)
      expect(pageCrawler.getPageUrls).toHaveBeenLastCalledWith(MOCKED_URL)
    })

    it('should throw error if any occured', async () => {
      ;(pageCrawler.getPageUrls as jest.Mock).mockRejectedValue('CrawlerError')

      await expect(crawlWebsite(MOCKED_URL)).rejects.toEqual('CrawlerError')

      expect(websiteRepository.addUniqueUrls).not.toHaveBeenCalled()
    })
  })
})
