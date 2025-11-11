import { Injectable } from '@nestjs/common';
import { CreateUserDto, GetUsersParam, UpdateUserDto } from './users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {} 

  async find(query: GetUsersParam) {
    const { page, pageSize, keyword } = query;
    const skip = Number((page - 1) * pageSize);
    const take = Number(pageSize);
    const users = await this.prisma.users.findMany({
      skip,
      take,
      where: {
        email: {
          contains: keyword
        }
      }
    })
    return users;
  }

  async create(data: CreateUserDto) {
    const existUser = await this.prisma.users.findUnique({
      where: {email: data.email}
    })
    if (existUser) {
      throw Error('User is exist !')
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
    if(data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }
}
