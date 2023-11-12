import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './transactions.entity';
import { UsersModule } from 'src/users/users.module';
import { Accounts } from 'src/users/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions, Accounts]), UsersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
