import { Cards } from 'src/cards/cards.entity';
import { TypeTrasanctions } from 'src/transactions/type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';
// import { Transaction } from 'typeorm';

export class CreateTransactionDto {
  trasac_nombre: string;
  trasac_descripcion: string;
  trasac_cantidad: number;
  trasac_saldo?: number;
  trasac_fecha?: Date;
  ttrac_id_fk: TypeTrasanctions;
  cuenta_id_fk?: Accounts;
  tarj_id_fk?: Cards;
}
