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
  card_id: string;

  @Column({ type: 'varchar', length: '25' })
  card_name: string;

  @Column({ type: 'varchar', length: '75' })
  card_description: string;

  @Column({ type: 'decimal', nullable: true })
  card_quota: number;

  @Column({ type: 'decimal' })
  card_balance_total: number;

  @Column({ type: 'decimal', nullable: true })
  card_balance_pay: number;

  @Column({ type: 'date', nullable: true })
  card_date_cutoff: Date;

  @Column({ type: 'date', nullable: true })
  card_date_due: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => TypeCards, (typeCard) => typeCard.cards)
  @JoinColumn({
    foreignKeyConstraintName: 'tiptarj_fk',
    name: 'typecard_id_fk',
  })
  typecard_id_fk: TypeCards;

  @ManyToOne(() => CardsBrands, (cardBrand) => cardBrand.cards)
  @JoinColumn({ foreignKeyConstraintName: 'bcard_fk', name: 'bcard_id_fk' })
  bcard_id_fk: CardsBrands;

  @ManyToOne(() => Accounts, (account) => account.cards)
  @JoinColumn({ foreignKeyConstraintName: 'account_fk', name: 'account_id_fk' })
  account_id_fk: Accounts;

  @OneToMany(() => Accounts, (account) => account.cards)
  transactions: Transactions;
}
