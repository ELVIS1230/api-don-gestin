import { CardsBrands } from 'src/cards/entities/cardBrand.entity';
import { TypeCards } from 'src/cards/entities/typeCards.entity';
import { Accounts } from 'src/users/accounts.entity';

export class CreateCardDto {
  card_name: string;
  card_description: string;
  quota_card: number;
  // total_balance_card?: number;
  // card_balance_pay?: number;
  cut_date_card: Date;
  expiration_date_card: Date;
  mtarj_id_fk: CardsBrands;
  tiptarj_id_fk: TypeCards;
  fk_id_account: Accounts;
}
