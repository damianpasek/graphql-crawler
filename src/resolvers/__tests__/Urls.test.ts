import * as websiteRepository from '../../repositories/website'
import * as crawler from '../../utils/crawler'
import { callGraphQL } from '../../test-utils/graphql'

describe('Urls Resolver', () => {
  const MOCKED_URL = 'https://test.website'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('crawlUrl', () => {
    beforeEach(() => {
      jest.spyOn(crawler, 'crawlWebsite').mockResolvedValue([
        'https://example.com',
      ])
    })

    const crawlUrlMutation = `
      mutation crawlUrlMutation($input: CrawlWebsiteInput!) {
        urls: crawlUrl(input: $input)
      }
    `

    const crawlUrl = (url: string) => callGraphQL({
      source: crawlUrlMutation,
      variableValues: {
        input: { url },
      },
    })

    it('should call page crawler and return list of crawled urls', async () => {
      const urls = await crawlUrl(MOCKED_URL)

      expect(urls.data.urls).toEqual(['https://example.com'])
      expect(crawler.crawlWebsite).toHaveBeenLastCalledWith(MOCKED_URL)
    })

    it.each([
      ['', false],
      ['not-really-an-url', false],
      ['https://test.website', true],
      ['http://test.website', true],
      ['https://test.website/some-subpage', true],
    ])('should validate url (%s)', async (url: string, correct: boolean) => {
      const urls = await crawlUrl(url)

      expect(!!urls.data).toBe(correct)
      expect(!urls.errors).toBe(correct)
    })

    it('should return error if any occured', async () => {
      const error = new Error('Page load error');

      (crawler.crawlWebsite as jest.Mock).mockImplementation(() => {
        throw error
      })

      const urls = await crawlUrl(MOCKED_URL)
      expect(urls.data).toBe(null)
      expect(urls.errors).toEqual([error])
    })
  })

  describe('getUrls', () => {
    beforeEach(() => {
      jest.spyOn(websiteRepository, 'retrieveWebsiteUrls').mockResolvedValue([
        'https://example.com',
      ])
    })

    const getUrlsQuery = `
      query getUrlsQuery($input: GetUrlsInput!) {
        urls: getUrls(input: $input)
      }
    `

    const getUrls = (url: string, limit: number, offset: number) => callGraphQL({
      source: getUrlsQuery,
      variableValues: {
        input: { url, limit, offset },
      },
    })

    it('should call website repository and return urls', async () => {
      const query = await getUrls(MOCKED_URL, 10, 30)

      expect(query.data.urls).toEqual(['https://example.com'])
      expect(websiteRepository.retrieveWebsiteUrls).toHaveBeenCalledWith(MOCKED_URL, 10, 30)
    })

    it('should throw error if any was thrown', async () => {
      const error = new Error('DB Connection Issue');

      (websiteRepository.retrieveWebsiteUrls as jest.Mock).mockImplementation(() => {
        throw error
      })

      const urls = await getUrls(MOCKED_URL, 10, 0)
      expect(urls.data).toBe(null)
      expect(urls.errors).toEqual([error])
    })

    it.each([
      ['', 10, 10, false],
      ['not-really-an-url', 10, 10, false],
      ['https://test.website', 10, 10, true],
      ['http://test.website', 10, 10, true],
      ['https://test.website/some-subpage', 10, 10, true],
      ['https://test.website', undefined, undefined, false],
      ['https://test.website', 'string', 'string', false],
      ['https://test.website', {}, [], false],
    ])('should validate url (%s)', async (
      url: string,
      limit: number,
      offset: number,
      correct: boolean,
    ) => {
      const urls = await getUrls(url, limit, offset)

      expect(!!urls.data).toBe(correct)
      expect(!urls.errors).toBe(correct)
    })
  })
})
