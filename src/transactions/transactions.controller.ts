import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Post()
  createTransaction(@Body() transaction: CreateTransactionDto) {
    return this.transactionsService.createTransaction(transaction);
  }

  @Get()
  getTransactions() {
    return this.transactionsService.getTransactions();
  }
}
