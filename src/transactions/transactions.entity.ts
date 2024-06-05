import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeTrasanctions } from './type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';
import { Cards } from 'src/cards/cards.entity';
import { Savings } from 'src/savings/savings.entity';

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'transactions_pk',
    type: 'integer',
  })
  trasac_id: number;

  @Column()
  trasac_name: string;

  @Column()
  trasac_description: string;

  @Column({ type: 'decimal' })
  trasac_quantity: number;

  @Column({ type: 'decimal' })
  trasac_balance: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(
    () => TypeTrasanctions,
    (typeTrasancions) => typeTrasancions.transactions,
  )
  @JoinColumn({ name: 'ttrac_id_fk', foreignKeyConstraintName: 'ttrac_id_fk' })
  ttrac_id_fk: TypeTrasanctions;

  @ManyToOne(() => Accounts, (account) => account.transactions)
  @JoinColumn({
    name: 'account_id_fk',
    foreignKeyConstraintName: 'account_fk',
  })
  account_id_fk: Accounts;

  @ManyToOne(() => Cards, (card) => card.transactions)
  @JoinColumn({
    name: 'card_id_fk',
    foreignKeyConstraintName: 'tarj_fk',
  })
  card_id_fk: Cards;

  @ManyToOne(() => Savings, (saving) => saving.trasactions)
  @JoinColumn({
    name: 'saving_id_fk',
    foreignKeyConstraintName: 'aho_fk',
  })
  saving_id_fk: Savings;
}
