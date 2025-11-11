export class CreateCategoryDto {
  name_vi: string;
  name_en: string;
  slug: string;
  order: number;
  creator_id?: string;
  modifier_id?: string;
}
export class PatchOrderDto {
  id: bigint;
  order: number;
}

export class GetCategoriesQuery {
  page: number;
  pageSize: number;
  keyword: string;
}
