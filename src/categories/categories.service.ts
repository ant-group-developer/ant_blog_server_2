import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  GetCategoriesQuery,
  PatchOrderDto,
  UpdateCategoryDto,
} from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      const category = await this.prisma.categories.create({ data });
      const categoryJson = {
        ...category,
        id: category.id.toString(),
      };
      return {
        data: categoryJson,
        message: 'Create category successfully!',
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async find(query: GetCategoriesQuery) {
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

      const categories = await this.prisma.categories.findMany({
        skip,
        take,
        where: {
          OR: [
            {
              name_en: {
                contains: keyword,
              },
            },
            {
              name_vi: {
                contains: keyword,
              },
            },
          ],
        },
      });
      const categoriesArray = categories.map((category) => ({
        ...category,
        id: category.id.toString(),
      }));
      const totalItems = await this.prisma.categories.count({
        where: {
          OR: [
            {
              name_en: {
                contains: keyword,
              },
            },
            {
              name_vi: {
                contains: keyword,
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalItems / take) || 0;
      return {
        data: categoriesArray,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalPage: totalPage,
          totalItem: totalItems,
        },
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async patchOrder(data: PatchOrderDto[]) {
    try {
      const categories = [];
      for (let i = 0; i < data.length; i++) {
        const category = await this.prisma.categories.update({
          where: { id: data[i].id },
          data: { order: data[i].order },
        });
        categories.push({
          ...category,
          id: category.id.toString(),
        });
      }
      return {
        data: categories,
        message: 'Update these orders successfully!',
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async patchOrderByCategoryId(id: number, data: UpdateCategoryDto) {
    try {
      const existCategory = await this.prisma.categories.findUnique({
        where: { id: id },
      });
      if (!existCategory) {
        return {
          message: 'This category is not exist !',
        };
      }
      const category = await this.prisma.categories.update({
        where: { id: id },
        data,
      });
      return {
        data: {
          ...category,
          id: category.id.toString(),
        },
        message: 'Update order of this category successfully !',
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async deleteCategory(id: number) {
    try {
      const existCategory = await this.prisma.categories.findUnique({
        where: { id: id },
      });

      if (!existCategory) {
        return {
          message: 'This category is not exist !',
        };
      }

      const category = await this.prisma.categories.delete({
        where: { id: id },
      });
      return {
        data: {
          ...category,
          id: category.id.toString(),
        },
        message: 'Delete the category successfully !',
      };
    } catch (error) {
      throw Error(error);
    }
  }
}
