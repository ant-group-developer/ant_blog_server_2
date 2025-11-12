import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, GetUsersQuery, UpdateUserDto, User } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async find(query: GetUsersQuery) {
    try {
      let { page, pageSize } = query;
      if(!page || !pageSize) {
        return {
          message: "Missing parameter!"
        }
      }
      const { keyword } = query;
      page = Number(page);
      pageSize = Number(pageSize);
      const skip = (page - 1) * pageSize;
      const take = pageSize;
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
    } catch (error) {
      throw Error(error);
    }
  }

  async create(data: CreateUserDto) {
    try {
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
        return {
          data: user,
          message: 'Create user successfully !',
        };
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      const existUser = await this.prisma.users.findUnique({
        where: { id },
      });
      if (!existUser) {
        return {
          message: 'This user is not exist',
        };
      }
      if (data.email && data.email !== existUser.email) {
        const existEmail = await this.prisma.users.findUnique({
          where: { email: data.email },
        });

        if (existEmail) {
          return {
            message: 'This email is already used in the system!',
          };
        }
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      await this.prisma.users.update({
        where: { id },
        data,
      });
      return {
        message: 'Update user successfully !',
      };
    } catch (error) {
      throw Error(error);
    }
  }
  async login(data: User) {
    try {
      const existUser = await this.prisma.users.findUnique({
        where: { email: data.email },
      });

      if (!existUser) {
        return {
          message: 'This email does not exist',
        };
      }

      const isMatch = await bcrypt.compare(data.password, existUser.password);
      if (!isMatch) {
        return {
          message: 'Wrong password!',
        };
      }

      const payload = {
        id: existUser.id,
        email: existUser.email,
      };

      const accessToken: string = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '30m' },
      );

      const refreshToken: string = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: '7d' },
      );
      const { password, ...userWithoutPassword } = existUser;
      return {
        message: 'Login success!',
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: userWithoutPassword
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
