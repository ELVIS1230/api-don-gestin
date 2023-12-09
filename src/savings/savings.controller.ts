import { Body, Controller, Post } from '@nestjs/common';
import { CreateSavingsDto } from 'src/dto/create-savings.dto';
import { SavingsService } from './savings.service';

@Controller('savings')
export class SavingsController {
  constructor(private savingsServices: SavingsService) {}
  @Post()
  createSaving(@Body() saving: CreateSavingsDto) {
    return this.savingsServices.createSavings(saving);
  }
}
