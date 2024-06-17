import { Savings } from 'src/savings/savings.entity';
import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';

export class SavingUpdateDto {
  amount: number;
  ttrac_id_fk: TypeTrasanctions;
  account_id_fk: Accounts;
  saving_id_fk: Savings;
}

export class SavingNameDto {
  saving_name: string;
}
