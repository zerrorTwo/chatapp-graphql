import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  userName: string;

  @Field(() => String, { nullable: true }) // Explicitly define as String
  avatarUrl?: string | null;

  @Field()
  email: string;

  @Field(() => Date, { nullable: true })
  emailVerifiedAt: Date | null; // Changed to Date | null to match Prisma

  @Field(() => Boolean, { nullable: true })
  status?: Boolean | null;

  @Field(() => String, { nullable: true })
  rememberToken?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UserPaginationResponse {
  @Field(() => [User])
  data: User[];

  @Field()
  total: number;

  @Field()
  currentPage: number;

  @Field()
  itemsPerPage: number;
}
