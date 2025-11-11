import { Controller, Get, Post, Param, Body, Patch, Query } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, GetUsersParam, UpdateUserDto } from './users.dto';
@Controller('cms/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  find(@Query() query: GetUsersParam) {
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
}
