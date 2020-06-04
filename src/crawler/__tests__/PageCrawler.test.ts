import puppeteer from 'puppeteer'

import * as pageCrawler from '../PageCrawler'

describe('PageCrawler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getPage', () => {
    let mockedPage
    let mockedBrowser

    const getMockedPage = () =>
      (({
        goto: jest.fn(),
      } as any) as puppeteer.Page)

    const getMockedBrowser = () =>
      (({
        close: jest.fn(),
        newPage: jest.fn().mockResolvedValue(mockedPage),
      } as any) as puppeteer.Browser)

    beforeEach(() => {
      mockedPage = getMockedPage()
      mockedBrowser = getMockedBrowser()
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockedBrowser)
    })

    it('should launch browser, go to given page and call calback with page object', async () => {
      const callback = jest.fn().mockResolvedValue('CallbackResolvedValue')

      const result = await pageCrawler.getPage('https://example.website', callback)

      expect(puppeteer.launch).toHaveBeenCalled()
      expect(result).toEqual('CallbackResolvedValue')
      expect(mockedBrowser.newPage).toHaveBeenCalled()
      expect(mockedPage.goto).toHaveBeenCalledWith('https://example.website')
      expect(callback).toHaveBeenCalledWith(mockedPage)
      expect(mockedBrowser.close).toHaveBeenCalled()
    })

    it('should throw an error if occurred and close browser', async () => {
      const callback = jest.fn().mockResolvedValue('CallbackResolvedValue')
      ;(mockedBrowser.newPage as jest.Mock).mockRejectedValue('NewPageError')

      await expect(pageCrawler.getPage('https://example.website', callback)).rejects.toBe(
        'NewPageError',
      )
      expect(callback).not.toHaveBeenCalled()
      expect(mockedBrowser.close).toHaveBeenCalled()
    })

    it('should throw an error if callback rejected and close browser', async () => {
      const callback = jest.fn().mockRejectedValue('CallbackRejectedValue')

      await expect(pageCrawler.getPage('https://example.website', callback)).rejects.toBe(
        'CallbackRejectedValue',
      )
      expect(callback).toHaveBeenCalledWith(mockedPage)
      expect(mockedBrowser.close).toHaveBeenCalled()
    })
  })

  describe('getPageUrls', () => {
    let mockedPage

    const getMockedPage = () =>
      ({
        goto: jest.fn(),
        $$eval: jest.fn().mockImplementation((element, mapper) => {
          const response = [
            { href: 'https://example.website' },
            { href: 'https://example.website' },
            { href: '' },
          ]

          expect(element).toBe('a')
          expect(mapper(response)).toEqual([
            'https://example.website',
            'https://example.website',
            '',
          ])

          return mapper(response)
        }),
      } as any)

    beforeEach(() => {
      mockedPage = getMockedPage()
      jest.spyOn(pageCrawler, 'getPage').mockImplementation(async (_, callback) => {
        return callback(mockedPage)
      })
    })

    it('should remove duplicated and empty urls', async () => {
      const urls = await pageCrawler.getPageUrls('http://test.website')

      expect(urls).toEqual(['https://example.website'])
    })

    it('should get website and return found urls', async () => {
      const urls = await pageCrawler.getPageUrls('http://test.website')
      const [[calledUrl]] = (pageCrawler.getPage as jest.Mock).mock.calls

      expect(urls).toEqual(['https://example.website'])
      expect(calledUrl).toBe('http://test.website')
    })

    it('should throw an error when occurred', async () => {
      jest.spyOn(pageCrawler, 'getPage').mockRejectedValue('ExampleError')

      await expect(pageCrawler.getPageUrls('http://test.website')).rejects.toBe('ExampleError')
    })
  })
})
