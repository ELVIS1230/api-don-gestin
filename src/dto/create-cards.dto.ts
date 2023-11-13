import { CardsBrands } from 'src/cards/entities/cardBrand.entity';
import { TypeCards } from 'src/cards/entities/typeCards.entity';
import { Accounts } from 'src/users/accounts.entity';

export class CreateCardDto {
  tarj_nombre: string;
  tarj_descripcion: string;
  tarj_cupo: number;
  tarj_saldo_total?: number;
  tarj_saldo_pagar?: number;
  tarj_fecha_corte: Date;
  tarj_fecha_vencimiento: Date;
  mtarj_id_fk: CardsBrands;
  tiptarj_id_fk: TypeCards;
  cuenta_id_fk: Accounts;
}
