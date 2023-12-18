import { Injectable } from '@nestjs/common';
// import { RemindersService } from './reminders/reminders.service';
import { TransactionsService } from './transactions/transactions.service';
// import { SavingsService } from './savings/savings.service';

@Injectable()
export class AppService {
  constructor(
    private transactionsServices: TransactionsService, // private remindersServices: RemindersService, //   private savingsServices: SavingsService,
  ) {}
  getDataDash() {
    // return
  }
}
