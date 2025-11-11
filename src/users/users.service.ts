import { Injectable } from '@nestjs/common';
import { CreateUserDto, GetUsersQuery, UpdateUserDto } from './users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async find(query: GetUsersQuery) {
    const { page, pageSize, keyword } = query;
    const skip = Number((page - 1) * pageSize);
    const take = Number(pageSize);
    const users = await this.prisma.users.findMany({
      skip,
      take,
      where: {
        email: {
          contains: keyword,
        },
      },
    });
    const totalItems = await this.prisma.users.count({
      where: {
        email: {
          contains: keyword,
        },
      },
    });
    const totalPage = Math.ceil(totalItems / take) || 0;
    return {
      data: users,
      pagination: {
        page: page,
        pageSise: pageSize,
        totalPage: totalPage,
        totalItem: totalItems,
      },
    };
  }

  async create(data: CreateUserDto) {
    const existUser = await this.prisma.users.findUnique({
      where: { email: data.email },
    });
    if (existUser) {
      return {
        message: 'User is exist',
      };
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const userData = { ...data, password: hashedPassword };
      const user = await this.prisma.users.create({
        data: userData,
      });
      return user;
    }
  }

  async update(id: string, data: UpdateUserDto) {
    const existUser = await this.prisma.users.findUnique({
      where: { id }
    })
    if(!existUser) {
      return {
        "message": "This user is not exist"
      }
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }
}
