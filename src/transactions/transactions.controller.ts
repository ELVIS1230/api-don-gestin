import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Post()
  createTransaction(@Body() transaction: CreateTransactionDto) {
    return this.transactionsService.createTransaction(transaction);
  }

  @Get(':id')
  getTransactions(@Param('id') id: string) {
    return this.transactionsService.getAllTransactions(id);
  }
}
