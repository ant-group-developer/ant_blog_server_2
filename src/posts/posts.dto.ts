import { IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
export class PostDto {
  @IsString()
  title_vi: string;

  @IsString()
  title_en: string;

  @IsString()
  description_vi: string;

  @IsString()
  description_en: string;

  @IsString()
  content_vi: string;

  @IsString()
  content_en: string;

  @IsString()
  thumbnail: string;

  @IsString()
  slug: string;
  creator_id?: string;
  modifier_id?: string;
  category_id: string;
}

export class GetPostsQuery {
  @Type(() => Number)
  @IsNumber()
  page: number;

  @Type(() => Number)
  @IsNumber()
  pageSize: number;

  @IsOptional()
  keyword?: string;
}

