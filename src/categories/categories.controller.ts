import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  GetCategoriesQuery,
  PatchOrderDto,
  UpdateCategoryDto,
} from './categories.dto';
import { CategoriesService } from './categories.service';
@Controller('cms/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoriesService.create(data);
  }

  @Get()
  find(@Query() query: GetCategoriesQuery) {
    return this.categoriesService.find(query);
  }

  @Patch('order')
  patchOrder(@Body() data: PatchOrderDto[]) {
    return this.categoriesService.patchOrder(data);
  }

  @Patch(':categoryId')
  patchOrderByCategoryId(
    @Param('categoryId') id: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoriesService.patchOrderByCategoryId(Number(id), data);
  }

  @Delete(':categoryId')
  deleteCategory(@Param('categoryId') id: string) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
