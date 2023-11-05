import { Controller, Get } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
  @Get()
  HelloWorld() {
    return 'Wenas noches';
  }
}
