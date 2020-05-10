import * as pageCrawler from '../../crawler/PageCrawler'
import { callGraphQL } from '../../test-utils/graphql'

describe('Urls Resolver', () => {
  beforeEach(() => {
    jest.spyOn(pageCrawler, 'getPageUrls').mockResolvedValue([
      'https://example.com',
    ])
  })

  const getUrlsQuery = `
    query getUrlsQuery($input: GetUrlsInput!) {
      getUrls(input: $input)
    }
  `

  const getUrls = (url: string) => callGraphQL({
    source: getUrlsQuery,
    variableValues: {
      input: { url },
    },
  })

  describe('getUrls', () => {
    it('should call page crawler and return list of crawler urls', async () => {
      const urls = await getUrls('https://test.website')

      expect(urls.data.getUrls).toEqual(['https://example.com'])
    })

    it.each([
      ['', false],
      ['not-really-an-url', false],
      ['https://test.website', true],
      ['http://test.website', true],
      ['https://test.website/some-subpage', true],
    ])('should validate url (%s)', async (url: string, correct: boolean) => {
      const urls = await getUrls(url)

      expect(!!urls.data).toBe(correct)
      expect(!urls.errors).toBe(correct)
    })

    it('should return error if any occured', async () => {
      const error = new Error('Page load error');

      (pageCrawler.getPageUrls as jest.Mock).mockImplementation(() => {
        throw error
      })

      const urls = await getUrls('https://test.website')
      expect(urls.data).toBe(null)
      expect(urls.errors).toEqual([error])
    })
  })
})
