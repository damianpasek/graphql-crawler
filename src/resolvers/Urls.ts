import { Mutation, Resolver, Query, PubSub, Root, Publisher, Arg, Subscription } from 'type-graphql'

import { NEW_URLS_STATS_TOPIC, INDEXED_URLS_STATS_TOPIC } from '../constants/topics'
import {
  NewUrlNotifictionPayload,
  NewUrlNotifiction,
  IndexedUrlsNotifictionPayload,
  IndexedUrlsNotifiction,
} from '../entities/UrlsNotification'
import { GetUrlsInput, CrawlWebsiteInput } from '../inputs/UrlsInput'
import { crawlWebsite } from '../utils/crawler'
import { retrieveWebsiteUrls } from '../repositories/website'

@Resolver()
export class UrlsResolver {
  @Mutation(() => [String])
  async crawlUrl(
    @Arg('input') { url }: CrawlWebsiteInput,
    @PubSub(NEW_URLS_STATS_TOPIC)
    publishNewUrl: Publisher<NewUrlNotifictionPayload>,
    @PubSub(INDEXED_URLS_STATS_TOPIC)
    publishIndexedUrls: Publisher<IndexedUrlsNotifictionPayload>,
  ) {
    await publishNewUrl({ url })
    const urls = await crawlWebsite(url)
    await publishIndexedUrls({ urls })

    return urls
  }

  @Query(() => [String])
  async getUrls(@Arg('input') { url, limit, offset }: GetUrlsInput) {
    const urls = await retrieveWebsiteUrls(url, limit, offset)

    return urls
  }

  @Subscription({ topics: NEW_URLS_STATS_TOPIC })
  newUrl(@Root() { url }: NewUrlNotifictionPayload): NewUrlNotifiction {
    return {
      url,
      date: new Date(),
    }
  }

  @Subscription({ topics: INDEXED_URLS_STATS_TOPIC })
  indexedUrls(@Root() { urls }: IndexedUrlsNotifictionPayload): IndexedUrlsNotifiction {
    return {
      urls,
      count: urls?.length || 0,
      date: new Date(),
    }
  }
}
