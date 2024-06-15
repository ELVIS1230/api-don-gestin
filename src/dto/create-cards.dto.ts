import { CardsBrands } from 'src/cards/entities/cardBrand.entity';
import { TypeCards } from 'src/cards/entities/typeCards.entity';
import { Accounts } from 'src/users/accounts.entity';

export class CreateCardDto {
  card_name: string;
  card_description: string;
  card_quota: number;
  // card_balance_total?: number;
  // card_balance_pay?: number;
  card_date_cutoff: Date;
  card_date_due: Date;
  bcard_id_fk: CardsBrands;
  typecard_id_fk: TypeCards;
  account_id_fk: Accounts;
}
