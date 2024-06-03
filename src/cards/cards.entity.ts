import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TypeCards } from './entities/typeCards.entity';
import { CardsBrands } from './entities/cardBrand.entity';
import { Accounts } from 'src/users/accounts.entity';
import { Transactions } from 'src/transactions/transactions.entity';

@Entity('cards')
export class Cards {
  @PrimaryColumn({
    primaryKeyConstraintName: 'cards_pk',
    type: 'varchar',
    length: 9,
  })
  tarj_id: string;

  @Column({ type: 'varchar', length: '25' })
  card_name: string;

  @Column({ type: 'varchar', length: '75' })
  card_description: string;

  @Column({ type: 'decimal', nullable: true })
  quota_card: number;

  @Column({ type: 'decimal' })
  total_balance_card: number;

  @Column({ type: 'decimal', nullable: true })
  card_balance_pay: number;

  @Column({ type: 'date', nullable: true })
  cut_date_card: Date;

  @Column({ type: 'date', nullable: true })
  expiration_date_card: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => TypeCards, (typeCard) => typeCard.cards)
  @JoinColumn({ foreignKeyConstraintName: 'tiptarj_fk', name: 'tiptarj_id_fk' })
  tiptarj_id_fk: TypeCards;

  @ManyToOne(() => CardsBrands, (cardBrand) => cardBrand.cards)
  @JoinColumn({ foreignKeyConstraintName: 'mtarj_fk', name: 'mtarj_id_fk' })
  mtarj_id_fk: CardsBrands;

  @ManyToOne(() => Accounts, (account) => account.cards)
  @JoinColumn({ foreignKeyConstraintName: 'fk_account', name: 'fk_id_account' })
  fk_id_account: Accounts;

  @OneToMany(() => Accounts, (account) => account.cards)
  transactions: Transactions;
}
