import { Cards } from 'src/cards/cards.entity';
import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';
// import { Transaction } from 'typeorm';

export class CreateTransactionDto {
  transfer_name: string;
  transfer_description: string;
  transfer_quantity: number;
  transfer_balance?: number;
  transfer_date?: Date;
  ttrac_id_fk: TypeTrasanctions;
  fk_id_account?: Accounts;
  tarj_id_fk?: Cards;
  aho_id_fk?: any;
}
