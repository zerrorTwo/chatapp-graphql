import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { GoogleLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { EXPIRESIN } from 'src/constants/access.token.expires';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;

  [key: string]: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async refreshToken(req: Request, res: Response): Promise<string> {
    const refreshToken: string = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }

    const { iat, exp, ...cleanPayload } = payload;

    const accessToken = this.jwtService.sign(cleanPayload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: EXPIRESIN,
    });

    return accessToken;
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    } else throw new BadRequestException('Password incorrect!');
  }

  async register(registerDto: RegisterDto, response: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException({ email: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        userName: registerDto.userName,
        password: hashedPassword,
        email: registerDto.email,
      },
    });
    return this.issueTokens(user, response);
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new BadRequestException({
        invalidCredentials: 'Invalid credentials',
      });
    }
    return this.issueTokens(user, response);
  }

  async googleLogin(googleLoginDto: GoogleLoginDto, response: Response) {
    const { email, googleId, name } = googleLoginDto;
    try {
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { googleId }],
        },
      });
      if (user) {
        throw new UnauthorizedException('User already in use');
      }
      const hashedPassword = await bcrypt.hash(googleId, 10);
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          userName: name,
          password: hashedPassword,
        },
      });

      return this.issueTokens(user, response);
    } catch {
      throw new UnauthorizedException('Invalid or expired login token');
    }
  }

  async logout(response: Response) {
    response.clearCookie('refresh_token');
    return 'Successfully logged out';
  }

  private async issueTokens(user: User, res: Response): Promise<any> {
    const payload = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: EXPIRESIN,
      },
    );
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user, accessToken };
  }

  async loginWithGoogleIdToken(idToken: string, res: Response) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub || !payload.name) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name;

    let user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          userName: name,
          password: await bcrypt.hash(googleId, 10), // or something random
        },
      });
    }

    return this.issueTokens(user, res);
  }
}
