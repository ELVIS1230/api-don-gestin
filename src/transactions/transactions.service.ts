import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Transactions } from './transactions.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
import { Accounts } from 'src/users/accounts.entity';
import { CardsService } from 'src/cards/cards.service';
import { Cards } from 'src/cards/cards.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private usersServices: UsersService,
    private cardsService: CardsService,
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
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      if (
        accountFound.cuenta_saldo <= 0.0 ||
        accountFound.cuenta_saldo < transaction.trasac_cantidad
      ) {
        return new HttpException(
          'La trasanccion supera el valor de su cuenta',
          HttpStatus.CONFLICT,
        );
      }
    }

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

  async createTrasanctionWithCard(transaction: CreateTransactionDto) {
    const cardFound = (await this.cardsService.getCard(
      transaction.tarj_id_fk.tarj_id,
    )) as Cards;

    if (cardFound instanceof HttpException) {
      return new HttpException('Tarjeta no encontrada ', HttpStatus.NOT_FOUND);
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      if (
        cardFound.tarj_saldo_total <= 0.0 ||
        cardFound.tarj_saldo_total < transaction.trasac_cantidad
      ) {
        return new HttpException(
          'La trasanccion supera el valor disponible de su tarjeta',
          HttpStatus.CONFLICT,
        );
      }
    }
    let balanceTotal = 0;

    if (transaction.ttrac_id_fk.ttrac_id === 1) {
      await this.cardsService.incrementBalanceCard(
        transaction.tarj_id_fk.tarj_id,
        transaction.trasac_cantidad,
      );

      balanceTotal =
        parseFloat(cardFound.tarj_saldo_total.toString()) +
        transaction.trasac_cantidad;
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      await this.cardsService.decrementBalanceCard(
        transaction.tarj_id_fk.tarj_id,
        transaction.trasac_cantidad,
      );

      balanceTotal =
        parseFloat(cardFound.tarj_saldo_total.toString()) -
        transaction.trasac_cantidad;
    }

    const newTrasanction = this.transactionsRepository.create({
      ...transaction,
      trasac_saldo: balanceTotal,
    });

    // console.log(cardFound);
    // console.log(transaction);
    return await this.transactionsRepository.save(newTrasanction);
  }
}
