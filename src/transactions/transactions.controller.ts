import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateTransactionDto } from 'src/dto/create-transactions.dto';
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

  @Get(':id')
  getTransactions(@Param('id') id: string) {
    return this.transactionsService.getAllTransactions(id);
  }

  @Get(':id/incomes')
  getTransactionsIncomes(@Param('id') id: string) {
    return this.transactionsService.getTransactionIncomes(id);
  }
  @Get(':id/expenses')
  getTransactionsExpenses(@Param('id') id: string) {
    return this.transactionsService.getTransactionExpenses(id);
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
