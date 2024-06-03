import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';

export class CreateSavingsDto {
  aho_name: string;
  aho_description: string;
  aho_meta_quantity: number;
  aho_total_amount: number;
  fk_id_account: Accounts;
  ttrac_id_fk: TypeTrasanctions;
}
