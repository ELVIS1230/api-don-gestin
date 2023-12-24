import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.createUsers(newUser);
  }

  @Post('/login')
  loginUser(@Body() userLogin: { email: string; password: string }) {
    return this.usersService.loginUser(userLogin);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get('/account/:id')
  getAccount(@Param('id') id: string) {
    return this.usersService.getAccount(id);
  }
}
