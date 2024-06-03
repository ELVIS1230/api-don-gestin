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

@Entity('Transactions')
export class Transactions {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'transactions_pk',
    type: 'integer',
  })
  trasac_id: number;

  @Column()
  transfer_name: string;

  @Column()
  transfer_description: string;

  @Column({ type: 'decimal' })
  transfer_quantity: number;

  @Column({ type: 'decimal' })
  transfer_balance: number;

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
    name: 'fk_id_account',
    foreignKeyConstraintName: 'fk_account',
  })
  fk_id_account: Accounts;

  @ManyToOne(() => Cards, (card) => card.transactions)
  @JoinColumn({
    name: 'tarj_id_fk',
    foreignKeyConstraintName: 'tarj_fk',
  })
  tarj_id_fk: Cards;

  @ManyToOne(() => Savings, (saving) => saving.trasactions)
  @JoinColumn({
    name: 'aho_id_fk',
    foreignKeyConstraintName: 'aho_fk',
  })
  aho_id_fk: Savings;
}
