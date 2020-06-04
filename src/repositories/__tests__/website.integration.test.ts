import { createDbConnection, closeDbConnection } from '../../config/db'
import { Website } from '../../entities/Website'
import { batchAddRecords, getRecords } from '../../test-utils/testDbTools'

import { retrieveWebsiteUrls, addUniqueUrls } from '../website'

describe('Website repository', () => {
  const MOCKED_WEBSITE_NAME = 'http://example.com'

  beforeEach(async () => {
    await createDbConnection()
  })

  afterEach(async () => {
    await closeDbConnection()
  })

  describe('retrieveWebsiteUrls', () => {
    beforeEach(async () => {
      await batchAddRecords(Website, [
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-1' },
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-2' },
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-3' },
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-4' },
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-5' },
      ])
    })

    it('should return all urls for given website if not limit and offset specified', async () => {
      const urls = await retrieveWebsiteUrls(MOCKED_WEBSITE_NAME)

      expect(urls).toEqual([
        'http://url-1',
        'http://url-2',
        'http://url-3',
        'http://url-4',
        'http://url-5',
      ])
    })

    it('should paginate results if limit and offset was given', async () => {
      expect(await retrieveWebsiteUrls(MOCKED_WEBSITE_NAME, 2, 0)).toEqual([
        'http://url-1',
        'http://url-2',
      ])
      expect(await retrieveWebsiteUrls(MOCKED_WEBSITE_NAME, 2, 2)).toEqual([
        'http://url-3',
        'http://url-4',
      ])
      expect(await retrieveWebsiteUrls(MOCKED_WEBSITE_NAME, 2, 4)).toEqual(['http://url-5'])
    })

    it('should return empty array if offset exceeds numer of records', async () => {
      expect(await retrieveWebsiteUrls(MOCKED_WEBSITE_NAME, 2, 100)).toEqual([])
    })

    it('should return empty array if no records were found', async () => {
      expect(await retrieveWebsiteUrls('http://not-existing-domain')).toEqual([])
    })
  })

  describe('addUniqueUrls', () => {
    beforeEach(async () => {
      await batchAddRecords(Website, [
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-1' },
        { name: MOCKED_WEBSITE_NAME, url: 'http://url-2' },
      ])
    })

    it('should add records to the database if urls were not existing', async () => {
      const name = 'http://new.website'
      const url = 'http://url-1'

      expect((await getRecords(Website, { name })).length).toBe(0)

      await addUniqueUrls(name, [url])

      const records = await getRecords(Website, { name })

      expect(records.length).toBe(1)
      expect(records).toEqual([{ id: 3, name, url }])
    })

    it('should add only new urls to the database', async () => {
      const EXISTING_URL = 'http://url-1'
      const NEW_URL = 'http://url-3'
      const where = { name: MOCKED_WEBSITE_NAME }

      expect((await getRecords(Website, where)).length).toBe(2)

      await addUniqueUrls(MOCKED_WEBSITE_NAME, [EXISTING_URL, NEW_URL])

      expect((await getRecords(Website, where)).length).toBe(3)
      expect((await getRecords(Website, { ...where, url: EXISTING_URL })).length).toBe(1)
      expect((await getRecords(Website, { ...where, url: NEW_URL })).length).toBe(1)
    })

    it('if there are no unique urls then no urls should be added to db', async () => {
      const EXISTING_URL = 'http://url-1'
      const where = { name: MOCKED_WEBSITE_NAME }

      expect((await getRecords(Website, where)).length).toBe(2)

      await addUniqueUrls(MOCKED_WEBSITE_NAME, [EXISTING_URL])

      expect((await getRecords(Website, where)).length).toBe(2)
    })
  })
})
