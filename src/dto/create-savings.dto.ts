import { Accounts } from 'src/users/accounts.entity';

export class CreateSavingsDto {
  aho_nombre: string;
  aho_descripcion: string;
  aho_cantidad: number;
  cuenta_id_fk: Accounts;
}
