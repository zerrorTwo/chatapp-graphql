import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserPaginationResponse } from './models/user.model';
import { CreateUserDto, UpdateUserDto, UserFilter } from './dto/user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserPaginationResponse)
  async getAllUser(
    @Args('filter') filter: UserFilter,
  ): Promise<UserPaginationResponse> {
    return await this.userService.findAll(filter);
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: number): Promise<User | null> {
    return await this.userService.findOne(Number(id));
  }

  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string): Promise<User | null> {
    return await this.userService.findByEmail(String(email));
  }

  @Mutation(() => User)
  async createUser(@Args('userData') userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('dataUpdate') dataUpdate: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateOneById(id, dataUpdate);
  }

  @Mutation(() => Boolean)
  async deleteOneById(@Args('id') id: number): Promise<boolean> {
    return await this.userService.deleteOneById(Number(id));
  }
}
