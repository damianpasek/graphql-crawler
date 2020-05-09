import { ObjectType, Field } from 'type-graphql'

export interface NewUrlNotifictionPayload {
  url: string
}

@ObjectType()
export class NewUrlNotifiction {
  @Field()
  url: string

  @Field(() => Date)
  date: Date
}

export interface IndexedUrlsNotifictionPayload {
  urls: string[]
}

@ObjectType()
export class IndexedUrlsNotifiction {
  @Field(() => [String], { nullable: true })
  urls: string[]

  @Field()
  count: number

  @Field(() => Date)
  date: Date
}
