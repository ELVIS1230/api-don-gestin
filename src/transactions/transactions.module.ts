import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './transactions.entity';
import { UsersModule } from 'src/users/users.module';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions]), UsersModule, CardsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
