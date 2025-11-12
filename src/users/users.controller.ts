import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UserDto, GetUsersQuery, Account } from './users.dto';
import { UsersService } from './users.service';
@Controller('cms/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  find(@Query() query: GetUsersQuery) {
    return this.usersService.find(query);
  }

  @Post()
  create(@Body() data: UserDto) {
    return this.usersService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UserDto) {
    return this.usersService.update(id, data);
  }

  @Post('/login')
  login(@Body() data: Account) {
    return this.usersService.login(data);
  }
}
