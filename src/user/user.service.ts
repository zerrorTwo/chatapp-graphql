import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dataUser: any): Promise<PrismaUser> {
    return this.prisma.user.create({ data: dataUser });
  }

  async findAll(): Promise<PrismaUser[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
