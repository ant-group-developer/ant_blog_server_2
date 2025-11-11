import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, PatchOrderDto } from './categories.dto';

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

  async findAll() {
    const categories = await this.prisma.categories.findMany();
    return categories.map((category) => ({
      ...category,
      id: category.id.toString(),
    }));
  }

  async patchOrder(data: PatchOrderDto[]) {
    for (let i = 0; i < data.length; i++) {
      await this.prisma.categories.update({
        where: { id: data[i].id },
        data: { order: data[i].order },
      });
    }
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
