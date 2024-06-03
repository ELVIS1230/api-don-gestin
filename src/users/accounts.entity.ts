import { Cards } from 'src/cards/cards.entity';
import { Savings } from 'src/savings/savings.entity';
import { Transactions } from 'src/transactions/transactions.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('cuentas')
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

  @OneToMany(() => Transactions, (transaction) => transaction.fk_id_account)
  transactions: Transactions[];

  @OneToMany(() => Cards, (card) => card.fk_id_account)
  cards: Cards[];

  @OneToMany(() => Savings, (saving) => saving.fk_id_account)
  savings: Savings[];
}
