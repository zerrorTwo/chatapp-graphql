import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User as PrismaUser } from '@prisma/client';
import { UpdateUserDto, UserFilter } from './dto/user.dto';
import { UserPaginationResponse } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dataUser: any): Promise<PrismaUser> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.prisma.user.create({ data: dataUser });
  }

  async findAll(filter: UserFilter): Promise<UserPaginationResponse> {
    const search = filter.search || '';
    const itemsPerPage = Number(filter.itemsPerPage) || 10;
    const page = Number(filter.page) || 1;

    const skip = page > 1 ? (page - 1) * itemsPerPage : 0;
    const users = await this.prisma.user.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          {
            fullname: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
    });

    const total = await this.prisma.user.count({
      where: {
        OR: [
          {
            fullname: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
    });

    return {
      data: users,
      total,
      currentPage: page,
      itemsPerPage,
    };
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(id: number): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateOneById(
    id: number,
    dataUpdate: UpdateUserDto,
  ): Promise<PrismaUser> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: dataUpdate,
    });
  }

  async deleteOneById(id: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.log('error=> ', error);
      return false;
    }
  }
}
