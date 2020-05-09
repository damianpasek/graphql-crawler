import puppeteer, { Page } from 'puppeteer'

export const findOnPage = async <T>(url: string, callback: (page: Page) => T): Promise<T> => {
  const browser = await puppeteer.launch()

  try {
    const page = await browser.newPage()
    await page.goto(url)

    const result = await callback(page)
    return result
  } finally {
    browser.close()
  }
}

const getLinkUrls: (page: Page) => Promise<string[]> = async (page: Page) =>
  page.$$eval('a', (as: any) => as.map((a: any): string => a.href))

export const getPageUrls = async (url: string): Promise<string[]> => {
  const urls = await findOnPage(url, getLinkUrls)
  return [...new Set(urls)].filter(Boolean)
}
