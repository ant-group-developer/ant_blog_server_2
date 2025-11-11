export class CreatePostDto {
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  content_vi: string;
  content_en: string;
  thumbnail: string;
  slug: string;
  creator_id?: string;
  modifier_id?: string;
  category_id: string;
}

export class GetPostsQuery {
  page: number;
  pageSize: number;
  keyword: string;
}

export class UpdatePostByIdDto {
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  content_vi: string;
  content_en: string;
  thumbnail: string;
  slug: string;
  creator_id?: string;
  modifier_id?: string;
  category_id: bigint;
}
