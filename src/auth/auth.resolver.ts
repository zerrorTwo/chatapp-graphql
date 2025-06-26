import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, RegisterResponse } from './models/auth.model';
import { GoogleLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password and confirm password are not the same.',
      });
    }
    const { user } = await this.authService.register(registerDto, context.res);
    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async ggLogin(
    @Args('ggLoginInput') googleLoginDto: GoogleLoginDto,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    return this.authService.googleLogin(googleLoginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }): Promise<string> {
    return this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<{ accessToken: string }> {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => String)
  async helloNe() {
    return 'hello123';
  }

  @Mutation(() => String)
  async setRefreshTokenCookie(
    @Context() context: { req: Request; res: Response },
  ): Promise<string> {
    try {
      return this.authService.setRefreshTokenCookie(context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
