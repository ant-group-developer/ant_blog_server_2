import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
export class CategoryDto {
  @IsString()
  name_vi: string;

  @IsString()
  name_en: string;

  @IsString()
  slug: string;

  @IsNumber()
  order: number;
  creator_id?: string;
  modifier_id?: string;
}
export class PatchOrderDto {
  id: bigint;
  order: number;
}

export class GetCategoriesQuery {
  @Type(() => Number)
  @IsNumber()
  page: number;

  @Type(() => Number)
  @IsNumber()
  pageSize: number;

  @IsOptional()
  keyword?: string;
}