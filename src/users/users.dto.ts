import { IsBoolean, IsEmail, IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from 'class-transformer';
export class GetUsersQuery {
  @Type(() => Number)
  @IsNumber()
  page: number;

  @Type(() => Number)
  @IsNumber()
  pageSize: number;

  @IsOptional()
  keyword?: string;
}
export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
  creator_id?: string;
  modifier_id?: string;

  @IsBoolean()
  status?: boolean;
}

export class Account{
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


