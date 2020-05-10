import { IsUrl, IsNumber } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class CrawlWebsiteInput {
  @Field()
  @IsUrl()
  url: string
}

@InputType()
export class GetUrlsInput {
  @Field()
  @IsUrl()
  url: string

  @Field()
  @IsNumber()
  limit: number

  @Field()
  @IsNumber()
  offset: number
}
