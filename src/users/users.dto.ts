export class GetUsersParam {
  page: number;
  pageSize: number;
  keyword: string;
}
export class CreateUserDto {
  email: string;
  password: string;
  creator_id?: string;
  modifier_id?: string;
  status?: boolean;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  modifier_id?: string;
  status?: boolean;
}
