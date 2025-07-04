import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserPaginationResponse } from './models/user.model';
import { CreateUserDto, UpdateUserDto, UserFilter } from './dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorator/auth.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => UserPaginationResponse)
  async getAllUser(
    @CurrentUser() user: User,
    @Args('filter') filter: UserFilter,
  ): Promise<UserPaginationResponse> {
    return await this.userService.findAll(filter);
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  async getUserById(@CurrentUser() user: User): Promise<User | null> {
    const id = user?.id;
    return await this.userService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string): Promise<User | null> {
    return await this.userService.findByEmail(String(email));
  }

  @Mutation(() => User)
  async createUser(@Args('userData') userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args('dataUpdate') dataUpdate: UpdateUserDto,
  ): Promise<User> {
    const id = user?.id;
    return await this.userService.updateOneById(id, dataUpdate);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteOneById(@Args('id') id: number): Promise<boolean> {
    return await this.userService.deleteOneById(Number(id));
  }
}
