import { Resolver, Query, PubSub, Root, Publisher, Arg, Subscription } from 'type-graphql'

import {
  NEW_URLS_STATS_TOPIC,
  INDEXED_URLS_STATS_TOPIC,
} from '../constants/topics'
import { getPageUrls } from '../crawler/PageCrawler'
import {
  NewUrlNotifictionPayload,
  NewUrlNotifiction,
  IndexedUrlsNotifictionPayload,
  IndexedUrlsNotifiction,
} from '../entities/UrlsNotification'
import { GetUrlsInput } from '../inputs/UrlsInput'

@Resolver()
export class UrlsResolver {
  @Query(() => [String])
  async getUrls (
    @Arg('input') { url }: GetUrlsInput,
    @PubSub(NEW_URLS_STATS_TOPIC) publishNewUrl: Publisher<NewUrlNotifictionPayload>,
    @PubSub(INDEXED_URLS_STATS_TOPIC) publishIndexedUrls: Publisher<IndexedUrlsNotifictionPayload>,
  ) {
    await publishNewUrl({ url })

    const urls = await getPageUrls(url)
    await publishIndexedUrls({ urls })

    return urls || []
  }

  @Subscription({ topics: NEW_URLS_STATS_TOPIC })
  newUrl (
    @Root() { url }: NewUrlNotifictionPayload,
  ): NewUrlNotifiction {
    return {
      url,
      date: new Date(),
    }
  }

  @Subscription({ topics: INDEXED_URLS_STATS_TOPIC })
  indexedUrls (
    @Root() { urls }: IndexedUrlsNotifictionPayload,
  ): IndexedUrlsNotifiction {
    return {
      urls,
      count: urls?.length || 0,
      date: new Date(),
    }
  }
}
