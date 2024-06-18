import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Transactions } from './transactions.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto, UpdateTransactionDto } from 'src/dto/create-transactions.dto';
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
        account_id_fk: { account_id: accountID_fk },
      },
      relations: ['account_id_fk', 'ttrac_id_fk'],
    });

    return !transactionsFound
      ? new HttpException('Transacciones no encotradas', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }

  getTransactionIncomes(accountID: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        account_id_fk: { account_id: accountID },
        ttrac_id_fk: { ttrac_id: 1 },
      },
      relations: ['ttrac_id_fk'],
    });
    return !transactionsFound
      ? new HttpException('Transacciones no encontradas', HttpStatus.NOT_FOUND)
      : transactionsFound;
  }
  deleteTransaction(transactionID: string) {
    const transactionsFound = this.transactionsRepository.delete(transactionID);
    return transactionsFound;
  }
  async updateTransaction(transactionID: number, updateTransactionDto: UpdateTransactionDto) {
    const transactionFound = await this.transactionsRepository.findOneBy({ trasac_id:transactionID });
    
    transactionFound.trasac_name = updateTransactionDto.name;
    transactionFound.trasac_description = updateTransactionDto.description;
    
    const  transactionUpdated = await this.transactionsRepository.save(transactionFound);
    return transactionUpdated;
  }
  getTransactionExpenses(accountID: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        account_id_fk: { account_id: accountID },
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
      transaction.account_id_fk.account_id,
    )) as Accounts;

    if (accountFound instanceof HttpException) {
      return new HttpException('Cuenta no encontrada ', HttpStatus.NOT_FOUND);
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      if (
        accountFound.account_balance <= 0.0 ||
        accountFound.account_balance < transaction.trasac_quantity
      ) {
        throw new BadRequestException({
          typeCode: 'TransactionWrong',
          message: 'La trasanccion supera el valor disponible de su tarjeta',
        });
      }
    }
    let balanceTotal: number = 0;
    if (transaction.ttrac_id_fk.ttrac_id === 1) {
      await this.usersServices.incrementBalanceAccount(
        transaction.account_id_fk.account_id,
        transaction.trasac_quantity,
      );
      balanceTotal =
        parseFloat(accountFound.account_balance.toString()) +
        transaction.trasac_quantity;
    } else if (
      transaction.ttrac_id_fk.ttrac_id === 2 ||
      transaction.ttrac_id_fk.ttrac_id === 3
    ) {
      await this.usersServices.decrementBalanceAccount(
        transaction.account_id_fk.account_id,
        transaction.trasac_quantity,
      );
      balanceTotal =
        parseFloat(accountFound.account_balance.toString()) -
        transaction.trasac_quantity;
    }

    const newTrasanction = this.transactionsRepository.create({
      ...transaction,
      trasac_balance: balanceTotal,
    });

    return await this.transactionsRepository.save(newTrasanction);
  }

  async createTrasanctionWithCard(transaction: CreateTransactionDto) {
    const cardFound = (await this.cardsService.getCard(
      transaction.card_id_fk.card_id,
    )) as Cards;
    if (cardFound instanceof HttpException) {
      return new HttpException('Tarjeta no encontrada ', HttpStatus.NOT_FOUND);
    }
    if (transaction.ttrac_id_fk.ttrac_id === 2) {
      if (
        cardFound.card_balance_total <= 0.0 ||
        cardFound.card_balance_total < transaction.trasac_quantity
      ) {
        throw new BadRequestException({
          typeCode: 'TransactionWrong',
          message: 'La trasanccion supera el valor disponible de su tarjeta',
        });
      }
    }
    let balanceTotal = 0;

    if (transaction.ttrac_id_fk.ttrac_id === 1) {
      await this.cardsService.incrementBalanceCard(
        transaction.card_id_fk.card_id,
        transaction.trasac_quantity,
      );

      balanceTotal =
        parseFloat(cardFound.card_balance_total.toString()) +
        transaction.trasac_quantity;
    } else if (transaction.ttrac_id_fk.ttrac_id === 2) {
      await this.cardsService.decrementBalanceCard(
        transaction.card_id_fk.card_id,
        transaction.trasac_quantity,
      );

      balanceTotal =
        parseFloat(cardFound.card_balance_total.toString()) -
        transaction.trasac_quantity;
    }

    const newTrasanction = this.transactionsRepository.create({
      ...transaction,
      trasac_balance: balanceTotal,
    });

    // console.log(cardFound);
    // console.log(transaction);
    return await this.transactionsRepository.save(newTrasanction);
  }

  async createReports(userID: string): Promise<Buffer> {
    const userFound = (await this.usersServices.getUser(userID)) as Users;
    console.log(userFound.account_id_fk.account_id);

    const transactionsFound = (await this.getAllTransactions(
      userFound.account_id_fk.account_id,
    )) as Transactions[];
    console.log(transactionsFound);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument();

      doc.text('Tus transacciones en un pdf');
      doc.moveDown();
      doc.text(`${userFound.u_name} ${userFound.u_lastname}`);

      const table = {
        headers: ['Trasaccion', 'Nombre', 'Cantidad', 'Total'],
        rows: transactionsFound.map((transaction) => [
          transaction.ttrac_id_fk.ttrac_name,
          transaction.trasac_name,
          transaction.trasac_quantity.toString(),
          transaction.trasac_balance.toString(),
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
    const resultados = await this.transactionsRepository
      .createQueryBuilder('transactions')
      .select([
        'EXTRACT(MONTH FROM "createdAt") as month',
        'EXTRACT(YEAR FROM "createdAt") as year',
        'ttrac_id_fk',
        'SUM(trasac_quantity) as total_amount',
      ])
      .where('transactions.account_id_fk = :account_id', {
        account_id: accountID,
      })
      .groupBy('year, month, ttrac_id_fk')
      .orderBy('year, month, ttrac_id_fk')
      .getRawMany();

    const resumen = {};
    resultados.forEach((resultado) => {
      const mes = resultado.month;
      const tipoTransaccion = resultado.ttrac_id_fk;
      const totalCantidad = parseFloat(resultado.total_amount);

      if (!resumen[mes]) {
        resumen[mes] = { 1: 0, 2: 0, 3: 0 };
      }

      resumen[mes][tipoTransaccion] = totalCantidad;
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
      transactions: dasTransactions,
      cards: dashCardsTransactions,
    };
  }
  async getDashTransactions(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: { account_id_fk: { account_id: accountID } },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['ttrac_id_fk', 'account_id_fk'],
    });
    console.log(registros);
    return registros;
  }

  async getDashTransactionsCards(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        card_id_fk: { account_id_fk: { account_id: accountID } },
      },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['ttrac_id_fk', 'account_id_fk', 'card_id_fk'],
    });
    return registros;
  }
  async getTansactionsCardsWithCards(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        card_id_fk: { account_id_fk: { account_id: accountID } },
      },
      order: { createdAt: 'DESC' },
      relations: ['ttrac_id_fk', 'account_id_fk', 'card_id_fk'],
    });
    return registros;
  }
  async getTansactionsCardsOneCard(cardID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        card_id_fk: { card_id: cardID },
      },
      order: { createdAt: 'DESC' },
      relations: ['ttrac_id_fk', 'card_id_fk'],
    });
    return registros;
  }

}

// async getDashReminders(){}
// }
