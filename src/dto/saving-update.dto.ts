import { Savings } from 'src/savings/savings.entity';
import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';

export class SavingUpdateDto {
  amount: number;
  ttrac_id_fk: TypeTrasanctions;
  fk_id_account: Accounts;
  aho_id_fk: Savings;
}
