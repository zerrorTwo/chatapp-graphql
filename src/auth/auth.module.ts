import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    ConfigService,
    PrismaService,
    JwtService,
  ],
})
export class AuthModule {}
