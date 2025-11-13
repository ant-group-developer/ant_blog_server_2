import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto, GetPostsQuery } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: PostDto) {
    try {
      const existCategory = await this.prisma.categories.findUnique({
        where: { id: BigInt(data.category_id) },
      });
      if (!existCategory) {
        return {
          message: 'This category is not exist !',
        };
      }
      const post = await this.prisma.posts.create({
        data: {
          ...data,
          category_id: data.category_id ? BigInt(data.category_id) : undefined,
        },
      });
      return {
        ...post,
        id: post.id.toString(),
        category_id: post.category_id.toString(),
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async find(query: GetPostsQuery) {
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
      const totalItems = await this.prisma.posts.count({
        where: {
          OR: [
            {
              title_vi: {
                contains: keyword,
              },
            },
            {
              title_en: {
                contains: keyword,
              },
            },
          ],
        },
      });
      const posts = await this.prisma.posts.findMany({
        skip,
        take,
        where: {
          OR: [
            {
              title_vi: {
                contains: keyword,
              },
            },
            {
              title_en: {
                contains: keyword,
              },
            },
          ],
        },
      });
      const postsArray = posts.map((post) => {
        return {
          ...post,
          id: post.id.toString(),
          category_id: post.category_id.toString(),
        };
      });
      const totalPage = Math.ceil(totalItems / take) || 0;
      return {
        data: postsArray,
        pagination: {
          page: page,
          pageSise: page,
          totalPage: totalPage,
          totalItem: totalItems,
        },
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async patchPostById(id: number, data: PostDto) {
    try {
      const existPost = await this.prisma.posts.findUnique({
        where: { id: id },
      });
      if (!existPost) {
        return {
          message: 'This post is not exist !',
        };
      }
      if(data.category_id && data.category_id !== existPost.category_id.toString()){
        const existCategory = await this.prisma.categories.findUnique({
          where: {id: BigInt(data.category_id)}
        });
        if(!existCategory) {
          return {
          message: 'The category is not exist in the system !',
        };
        }
      }
      const post = await this.prisma.posts.update({
        where: { id: id },
        data: { ...data, category_id: BigInt(data.category_id) },
      });
      return {
        data: {
          ...post,
          id: post.id.toString(),
          category_id: post.category_id.toString(),
        },
        message: 'Update this post successfully !',
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async deletePost(id: number) {
    try {
      const existPost = await this.prisma.posts.findUnique({
        where: { id: id },
      });
      if (!existPost) {
        return {
          message: 'This post is not exist !',
        };
      }
      await this.prisma.posts.delete({ where: { id: id } });
      return {
        message: 'Post deleted successfully',
      };
    } catch (error) {
      throw Error(error);
    }
  }

  async findPostById(id: number) {
    try {
      const post = await this.prisma.posts.findUnique({
        where: { id: id },
      });
      if (!post) {
        return {
          message: 'This post is not exist !',
        };
      }
      return {
        ...post,
        id: post.id.toString(),
        category_id: post.category_id.toString(),
      };
    } catch (error) {
      throw Error(error);
    }
  } 
}
