import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';

export class CreateSavingsDto {
  saving_name: string;
  saving_description: string;
  saving_goal_quantity: number;
  saving_quantity_total: number;
  account_id_fk: Accounts;
  ttrac_id_fk: TypeTrasanctions;
}
