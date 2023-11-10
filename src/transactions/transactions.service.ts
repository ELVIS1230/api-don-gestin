import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Transactions } from './transactions.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
import { Accounts } from 'src/users/accounts.entity';
// import { Accounts } from 'src/users/accounts.entity';
// import { Users } from 'src/users/users.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private usersServices: UsersService,
  ) {}

  getTransactions() {
    return this.transactionsRepository.find();
  }
  getOneTransaction() {}

  async createTransaction(transaction: CreateTransactionDto) {
    const accountFound = (await this.usersServices.getAccount(
      transaction.cuenta_id_fk,
    )) as Accounts;

    console.log(accountFound);
    if (accountFound instanceof HttpException) {
      return new HttpException('Cuenta no encontrada ', HttpStatus.NOT_FOUND);
    } else if (
      accountFound.cuenta_saldo == 0.0 &&
      transaction.ttrac_id_fk === 2
    ) {
      return new HttpException('La cuenta esta en cero ', HttpStatus.CONFLICT);
    }
    if (transaction.ttrac_id_fk === 1) {
      await this.usersServices.incrementBalanceAccount(
        transaction.cuenta_id_fk,
        transaction.trasac_cantidad,
      );
    } else if (transaction.ttrac_id_fk === 2) {
      await this.usersServices.decrementBalanceAccount(
        transaction.cuenta_id_fk,
        transaction.trasac_cantidad,
      );
    }
    const newTrasanction = this.transactionsRepository.create(transaction);
    return await this.transactionsRepository.save(newTrasanction);
  }
}
