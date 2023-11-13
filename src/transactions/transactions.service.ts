import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Transactions } from './transactions.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
import { Accounts } from 'src/users/accounts.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private usersServices: UsersService,
  ) {}

  getAllTransactions(cuentaID_fk: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        cuenta_id_fk: { cuenta_id: cuentaID_fk },
      },
      relations: ['cuenta_id_fk'],
    });

    return !transactionsFound
      ? new HttpException('Transacciones no encotradas', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }

  getTransactionIncomes(cuentaID: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        cuenta_id_fk: { cuenta_id: cuentaID },
        ttrac_id_fk: { ttrac_id: 1 },
      },
      relations: ['ttrac_id_fk'],
    });
    return !transactionsFound
      ? new HttpException('Transacciones no encontradas', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }
  getTransactionExpenses(cuentaID: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        cuenta_id_fk: { cuenta_id: cuentaID },
        ttrac_id_fk: { ttrac_id: 2 },
      },
      relations: ['ttrac_id_fk'],
    });
    return !transactionsFound
      ? new HttpException('Transacciones no encontradas', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }

  async createTransaction(transaction: CreateTransactionDto) {
    const accountFound = (await this.usersServices.getAccount(
      transaction.cuenta_id_fk.cuenta_id,
    )) as Accounts;

    if (accountFound instanceof HttpException) {
      return new HttpException('Cuenta no encontrada ', HttpStatus.NOT_FOUND);
    } else if (
      accountFound.cuenta_saldo <= 0.0 &&
      transaction.ttrac_id_fk.ttrac_id === 2
    ) {
      return new HttpException('La cuenta esta en cero ', HttpStatus.CONFLICT);
    }
    console.log(accountFound);
    console.log(transaction);
    let balanceTotal: number = 0;
    if (transaction.ttrac_id_fk.ttrac_id === 1) {
      await this.usersServices.incrementBalanceAccount(
        transaction.cuenta_id_fk.cuenta_id,
        transaction.trasac_cantidad,
      );
      balanceTotal =
        parseFloat(accountFound.cuenta_saldo.toString()) +
        transaction.trasac_cantidad;
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      await this.usersServices.decrementBalanceAccount(
        transaction.cuenta_id_fk.cuenta_id,
        transaction.trasac_cantidad,
      );
      balanceTotal =
        parseFloat(accountFound.cuenta_saldo.toString()) -
        transaction.trasac_cantidad;
    }

    const newTrasanction = this.transactionsRepository.create({
      ...transaction,
      trasac_saldo: balanceTotal,
    });
    return await this.transactionsRepository.save(newTrasanction);
  }
}
