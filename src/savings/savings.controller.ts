import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSavingsDto } from 'src/dto/create-savings.dto';
import { SavingsService } from './savings.service';
import { SavingUpdateDto } from 'src/dto/saving-update.dto';

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

  @Delete('/:id')
  deleteSaving(@Param('id') id: string) {
    return this.savingsServices.deleteSaving(id);
  }

  @Patch('/amount')
  updateAmountSaving(@Body() savingUpdate: SavingUpdateDto) {
    return this.savingsServices.updateAmountSaving(savingUpdate);
  }
}
