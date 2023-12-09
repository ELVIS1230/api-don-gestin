import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSavingsDto } from 'src/dto/create-savings.dto';
import { SavingsService } from './savings.service';

@Controller('savings')
export class SavingsController {
  constructor(private savingsServices: SavingsService) {}
  @Get(':AccountID')
  getAllSavings(@Param('AccountID') AccountID: string) {
    return this.savingsServices.getAllSavings(AccountID);
  }

  @Post()
  createSaving(@Body() saving: CreateSavingsDto) {
    return this.savingsServices.createSavings(saving);
  }
}
