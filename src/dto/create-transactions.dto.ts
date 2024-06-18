import { Cards } from 'src/cards/cards.entity';
import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';
// import { Transaction } from 'typeorm';

export class CreateTransactionDto {
  trasac_name: string;
  trasac_description: string;
  trasac_quantity: number;
  trasac_balance?: number;
  trasac_date?: Date;
  ttrac_id_fk: TypeTrasanctions;
  account_id_fk?: Accounts;
  card_id_fk?: Cards;
  saving_id_fk?: any;
}

export class UpdateTransactionDto {
  name: string;
  description: string;
}
