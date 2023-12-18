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

  getAllTransactions(cuentaID_fk: string) {
    const transactionsFound = this.transactionsRepository.find({
      where: {
        cuenta_id_fk: { cuenta_id: cuentaID_fk },
      },
      relations: ['cuenta_id_fk', 'ttrac_id_fk'],
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
  deleteTransaction(transactionID: string) {
    const transactionsFound = this.transactionsRepository.delete(transactionID);
    return transactionsFound;
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
    } else if (
      transaction.ttrac_id_fk.ttrac_id === 2 ||
      transaction.ttrac_id_fk.ttrac_id === 3
    ) {
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

  async createReports(userID: string): Promise<Buffer> {
    const userFound = (await this.usersServices.getUser(userID)) as Users;
    console.log(userFound.cuenta_id_fk.cuenta_id);

    const transactionsFound = (await this.getAllTransactions(
      userFound.cuenta_id_fk.cuenta_id,
    )) as Transactions[];
    console.log(transactionsFound);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument();

      doc.text('PDF generado');
      doc.moveDown();
      doc.text('Ejemplo con next js');

      const table = {
        headers: ['Trasaccion', 'Nombre', 'Cantidad', 'Total'],
        rows: transactionsFound.map((transaction) => [
          transaction.ttrac_id_fk.ttracc_nombre,
          transaction.trasac_nombre,
          transaction.trasac_cantidad.toString(),
          transaction.trasac_saldo.toString(),
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
      .createQueryBuilder('trasacciones')
      .select([
        'EXTRACT(MONTH FROM "createdAt") as month',
        'EXTRACT(YEAR FROM "createdAt") as year',
        'ttrac_id_fk',
        'SUM(trasac_cantidad) as total_amount',
      ])
      .where('trasacciones.cuenta_id_fk = :cuenta_id', {
        cuenta_id: accountID,
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
      trasacciones: dasTransactions,
      tarjetas: dashCardsTransactions,
    };
  }
  async getDashTransactions(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: { cuenta_id_fk: { cuenta_id: accountID } },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['ttrac_id_fk', 'cuenta_id_fk'],
    });
    return registros;
  }

  async getDashTransactionsCards(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        tarj_id_fk: { cuenta_id_fk: { cuenta_id: accountID } },
      },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['ttrac_id_fk', 'cuenta_id_fk', 'tarj_id_fk'],
    });
    return registros;
  }
  async getTansactionsCardsWithCards(accountID: string) {
    const registros = await this.transactionsRepository.find({
      where: {
        tarj_id_fk: { cuenta_id_fk: { cuenta_id: accountID } },
      },
      order: { createdAt: 'DESC' },
      relations: ['ttrac_id_fk', 'cuenta_id_fk', 'tarj_id_fk'],
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
