import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  fullname: string;

  @Field(() => String, { nullable: true }) // Explicitly define as String
  avatarUrl?: string | null;

  @Field()
  email: string;

  @Field(() => Date, { nullable: true })
  emailVerifiedAt: Date | null; // Changed to Date | null to match Prisma

  @Field(() => String, { nullable: true })
  rememberToken?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
