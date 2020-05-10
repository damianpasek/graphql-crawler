import { IsUrl } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class GetUrlsInput {
  @Field()
  @IsUrl()
  url: string
}
