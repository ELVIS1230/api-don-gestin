import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CreateTransactionDto, UpdateTransactionDto } from 'src/dto/create-transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Post()
  createTransaction(@Body() transaction: CreateTransactionDto) {
    return this.transactionsService.createTransaction(transaction);
  }
  @Post('/cards')
  createTransactionWithCard(@Body() transaction: CreateTransactionDto) {
    return this.transactionsService.createTrasanctionWithCard(transaction);
  }
  @Delete(':id')
  deleteTransaction(@Param('id') id: string) {
    return this.transactionsService.deleteTransaction(id);
  }
  @Put(':id')
  updateTransaction(@Param('id') id: number,
  @Body() updateTransactionDto: UpdateTransactionDto,
) {
    return this.transactionsService.updateTransaction(id, updateTransactionDto);
  }
  @Get(':id')
  getTransactions(@Param('id') id: string) {
    return this.transactionsService.getAllTransactions(id);
  }
  @Get('cards/:id')
  getTransactionsWithCards(@Param('id') id: string) {
    return this.transactionsService.getTansactionsCardsWithCards(id);
  }

  @Get(':id/incomes')
  getTransactionsIncomes(@Param('id') id: string) {
    return this.transactionsService.getTransactionIncomes(id);
  }
  @Get(':id/expenses')
  getTransactionsExpenses(@Param('id') id: string) {
    return this.transactionsService.getTransactionExpenses(id);
  }

  @Get('/oneCard/transactions/:cardID')
  getTransactionsOneCard(@Param('cardID') cardID: string) {
    return this.transactionsService.getTansactionsCardsOneCard(cardID);
  }

  @Get('/dash/:id')
  getDash(@Param('id') id: string) {
    return this.transactionsService.dataDash(id);
  }

  @Get('/reports/:idUser')
  async createReports(
    @Res() res,
    @Param('idUser') idUser: string,
    // @Param('idAccount') idAccount: string,
  ) {
    const buffer = await this.transactionsService.createReports(idUser);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reportes`,
      'Content-Length': buffer.length,
    });

    // Llamada al servicio para generar el PDF
    // const pdfBuffer = this.transactionsService.createReports(idUser);

    // Enviar el PDF generado como respuesta
    res.end(buffer);
  }
}
