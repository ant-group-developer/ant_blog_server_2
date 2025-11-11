import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, PatchOrderDto } from './categories.dto';
@Controller('cms/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoriesService.create(data);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Patch('order')
  patchOrder(@Body() data: PatchOrderDto[]) {
    return this.categoriesService.patchOrder(data);
  }

  @Patch(':category-id')
  patchOrderByCategoryId(
    @Param('category-id') id: string,
    @Body() order: number,
  ) {
    return this.categoriesService.patchOrderByCategoryId(BigInt(id), order);
  }

  @Delete(':category-id')
  deleteCategory(@Param('category-id') id: string) {
    return this.categoriesService.deleteCategory(BigInt(id));
  }
}
