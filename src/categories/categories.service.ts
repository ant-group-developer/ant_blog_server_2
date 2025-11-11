import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, GetCategoriesQuery, PatchOrderDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const category = await this.prisma.categories.create({ data });
    return {
      ...category,
      id: category.id.toString(),
    };
  }

  async find(query: GetCategoriesQuery) {
    let { page, pageSize, keyword } = query;
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
    const totalItems = await this.prisma.categories.count();
    const totalPage = Math.ceil(totalItems / take) || 0;
    return {
      "data": categoriesArray,
      "pagination": {
        "page": page,
        "pageSize": pageSize,
        "totalPage": totalPage,
        "totalItem": totalItems
      }
    }
  }

  async patchOrder(data: PatchOrderDto[]) {
    let categories = [];
    for (let i = 0; i < data.length; i++) {
      let category = await this.prisma.categories.update({
        where: { id: data[i].id },
        data: { order: data[i].order },
      });
      categories.push({
        ...category,
        id: category.id.toString(),
      });
    }
    return categories;
  }

  async patchOrderByCategoryId(id: bigint, order: number) {
    return this.prisma.categories.update({
      where: { id },
      data: { order },
    });
  }

  async deleteCategory(id: bigint) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    return this.prisma.categories.delete({
      where: { id },
    });
  }
}
