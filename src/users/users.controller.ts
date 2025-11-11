import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateUserDto, GetUsersQuery, UpdateUserDto, User } from './users.dto';
import { UsersService } from './users.service';
@Controller('cms/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  find(@Query() query: GetUsersQuery) {
    return this.usersService.find(query);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Post('/login')
  login(@Body() data: User) {
    return this.usersService.login(data);
  }
}
