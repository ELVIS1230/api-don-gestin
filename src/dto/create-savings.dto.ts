import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';

export class CreateSavingsDto {
  aho_nombre: string;
  aho_descripcion: string;
  aho_meta_cantidad: number;
  aho_cantidad_total: number;
  cuenta_id_fk: Accounts;
  ttrac_id_fk: TypeTrasanctions;
}
