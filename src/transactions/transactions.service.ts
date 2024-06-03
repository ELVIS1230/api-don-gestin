import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Transactions } from './transactions.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
import { Accounts } from 'src/users/accounts.entity';
import { CardsService } from 'src/cards/cards.service';
import { Cards } from 'src/cards/cards.entity';
import { Users } from 'src/users/users.entity';
// import * as PDFDocument from 'pdfkit';
// import 'pdfkit-tables';
import PDFDocument from 'pdfkit-table';
// import { SavingsService } from 'src/savings/savings.service';
// import { PDFDocument } from 'pdfkit';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private usersServices: UsersService,
    private cardsService: CardsService, // private savingsService: SavingsService,
  ) {}

  getAllTransactions(accountID_fk: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        fk_id_account: { account_id: accountID_fk },
      },
      relations: ['fk_id_account', 'ttrac_id_fk'],
    });

    return !transactionsFound
      ? new HttpException('Transactions not found', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }

  getTransactionIncomes(accountID: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        fk_id_account: { account_id: accountID },
        ttrac_id_fk: { ttrac_id: 1 },
      },
      relations: ['ttrac_id_fk'],
    });
    return !transactionsFound
      ? new HttpException('Transactions not found', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }
  deleteTransaction(transactionID: string) {
    const transactionsFound = this.transactionsRepository.delete(transactionID);
    return transactionsFound;
  }
  getTransactionExpenses(accountID: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        fk_id_account: { account_id: accountID },
        ttrac_id_fk: { ttrac_id: 2 },
      },
      relations: ['ttrac_id_fk'],
    });
    return !transactionsFound
      ? new HttpException('Transactions not found', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }

  async createTransaction(transaction: CreateTransactionDto) {
    const accountFound = (await this.usersServices.getAccount(
      transaction.fk_id_account.account_id,
    )) as Accounts;

    if (accountFound instanceof HttpException) {
      return new HttpException('Account not found ', HttpStatus.NOT_FOUND);
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      if (
        accountFound.account_balance <= 0.0 ||
        accountFound.account_balance < transaction.transfer_quantity
      ) {
        return new HttpException(
          'The transaction exceeds the value of your account',
          HttpStatus.CONFLICT,
        );
      }
    }

    let balanceTotal: number = 0;
    if (transaction.ttrac_id_fk.ttrac_id === 1) {
      await this.usersServices.incrementBalanceAccount(
        transaction.fk_id_account.account_id,
        transaction.transfer_quantity,
      );
      balanceTotal =
        parseFloat(accountFound.account_balance.toString()) +
        transaction.transfer_quantity;
    } else if (
      transaction.ttrac_id_fk.ttrac_id === 2 ||
      transaction.ttrac_id_fk.ttrac_id === 3
    ) {
      await this.usersServices.decrementBalanceAccount(
        transaction.fk_id_account.account_id,
        transaction.transfer_quantity,
      );
      balanceTotal =
        parseFloat(accountFound.account_balance.toString()) -
        transaction.transfer_quantity;
    }

    const newTrasanction = this.transactionsRepository.create({
      ...transaction,
      transfer_balance: balanceTotal,
    });

    return await this.transactionsRepository.save(newTrasanction);
  }

  async createTrasanctionWithCard(transaction: CreateTransactionDto) {
    const cardFound = (await this.cardsService.getCard(
      transaction.tarj_id_fk.tarj_id,
    )) as Cards;

    if (cardFound instanceof HttpException) {
      return new HttpException('Card not found ', HttpStatus.NOT_FOUND);
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      if (
        cardFound.total_balance_card <= 0.0 ||
        cardFound.total_balance_card < transaction.transfer_quantity
      ) {
        return new HttpException(
          'The transaction exceeds the available value of your card',
          HttpStatus.CONFLICT,
        );
      }
    }
    let balanceTotal = 0;

    if (transaction.ttrac_id_fk.ttrac_id === 1) {
      await this.cardsService.incrementBalanceCard(
        transaction.tarj_id_fk.tarj_id,
        transaction.transfer_quantity,
      );

      balanceTotal =
        parseFloat(cardFound.total_balance_card.toString()) +
        transaction.transfer_quantity;
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      await this.cardsService.decrementBalanceCard(
        transaction.tarj_id_fk.tarj_id,
        transaction.transfer_quantity,
      );

      balanceTotal =
        parseFloat(cardFound.total_balance_card.toString()) -
        transaction.transfer_quantity;
    }

    const newTrasanction = this.transactionsRepository.create({
      ...transaction,
      transfer_balance: balanceTotal,
    });

    // console.log(cardFound);
    // console.log(transaction);
    return await this.transactionsRepository.save(newTrasanction);
  }

  async createReports(userID: string): Promise<Buffer> {
    const userFound = (await this.usersServices.getUser(userID)) as Users;
    console.log(userFound.fk_id_account.account_id);

    const transactionsFound = (await this.getAllTransactions(
      userFound.fk_id_account.account_id,
    )) as Transactions[];
    console.log(transactionsFound);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument();

      doc.text('Your transactions in a pdf');
      doc.moveDown();
      doc.text(`${userFound.u_name} ${userFound.u_lastname}`);

      const table = {
        headers: ['Transaction', 'Name', 'Amount', 'Total'],
        rows: transactionsFound.map((transaction) => [
          transaction.ttrac_id_fk.ttracc_name,
          transaction.transfer_name,
          transaction.transfer_quantity.toString(),
          transaction.transfer_balance.toString(),
        ]),
      };
      doc.moveDown().table(table, { width: 400 });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const data = Buffer.concat(buffers);
        resolve(data);
      });
      doc.end();
    });

    return pdfBuffer;
  }

  async dataDash(accountID: string) {
    const results = await this.transactionsRepository
      .createQueryBuilder('transactions')
      .select([
        'EXTRACT(MONTH FROM "createdAt") as month',
        'EXTRACT(YEAR FROM "createdAt") as year',
        'ttrac_id_fk',
        'SUM(transfer_quantity) as total_amount',
      ])
      .where('Transactions.fk_id_account = :account_id', {
        account_id: accountID,
      })
      .groupBy('year, month, ttrac_id_fk')
      .orderBy('year, month, ttrac_id_fk')
      .getRawMany();

    const resumen = {};
    results.forEach((result) => {
      const mes = result.month;
      const tipoTransaccion = result.ttrac_id_fk;
      const totalAmount = parseFloat(result.total_amount);

      if (!resumen[mes]) {
        resumen[mes] = { 1: 0, 2: 0, 3: 0 };
      }

      resumen[mes][tipoTransaccion] = totalAmount;
    });

    // Llenar con 0 los meses sin registros
    for (let i = 1; i <= 12; i++) {
      if (!resumen[i]) {
        resumen[i] = { 1: 0, 2: 0, 3: 0 };
      }
    }
    const dasTransactions = await this.getDashTransactions(accountID);
    const dashCardsTransactions =
      await this.getDashTransactionsCards(accountID);
    return {
      comparaciones: resumen,
      Transactions: dasTransactions,
      cards: dashCardsTransactions,
    };
  }
  async getDashTransactions(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: { fk_id_account: { account_id: accountID } },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['ttrac_id_fk', 'fk_id_account'],
    });
    return registros;
  }

  async getDashTransactionsCards(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        tarj_id_fk: { fk_id_account: { account_id: accountID } },
      },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['ttrac_id_fk', 'fk_id_account', 'tarj_id_fk'],
    });
    return registros;
  }
  async getTansactionsCardsWithCards(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        tarj_id_fk: { fk_id_account: { account_id: accountID } },
      },
      order: { createdAt: 'DESC' },
      relations: ['ttrac_id_fk', 'fk_id_account', 'tarj_id_fk'],
    });
    return registros;
  }
  async getTansactionsCardsOneCard(cardID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        tarj_id_fk: { tarj_id: cardID },
      },
      order: { createdAt: 'DESC' },
      relations: ['ttrac_id_fk', 'tarj_id_fk'],
    });
    return registros;
  }
}

// async getDashReminders(){}
// }
