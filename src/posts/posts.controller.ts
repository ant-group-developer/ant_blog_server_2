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
import { PostDto, GetPostsQuery } from './posts.dto';
import { PostsService } from './posts.service';

@Controller('cms/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  create(@Body() data: PostDto) {
    return this.postsService.create(data);
  }

  @Get()
  find(@Query() query: GetPostsQuery) {
    return this.postsService.find(query);
  }

  @Patch(':postId')
  patchPostById(@Param('postId') id: string, @Body() data: PostDto) {
    return this.postsService.patchPostById(Number(id), data);
  }

  @Delete(':postId')
  deletePost(@Param('postId') id: string) {
    return this.postsService.deletePost(Number(id));
  }
}
