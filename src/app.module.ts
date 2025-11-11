import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, CategoriesModule, PostsModule],
})
export class AppModule {}
