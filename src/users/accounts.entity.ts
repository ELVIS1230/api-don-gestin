import { Cards } from 'src/cards/cards.entity';
import { Savings } from 'src/savings/savings.entity';
import { Transactions } from 'src/transactions/transactions.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('accounts')
export class Accounts {
  // @Column({ unique: true })
  @PrimaryColumn({ primaryKeyConstraintName: 'account_id_pk' })
  account_id: string;

  @Column({ type: 'decimal', default: () => '00.00' })
  account_balance: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Transactions, (transaction) => transaction.account_id_fk)
  transactions: Transactions[];

  @OneToMany(() => Cards, (card) => card.account_id_fk)
  cards: Cards[];

  @OneToMany(() => Savings, (saving) => saving.account_id_fk)
  savings: Savings[];
}
