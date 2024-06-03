import { Transactions } from 'src/transactions/transactions.entity';
import { Accounts } from 'src/users/accounts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('ahorros')
export class Savings {
  @PrimaryColumn({
    primaryKeyConstraintName: 'saving_pk',
  })
  aho_id: string;

  @Column({ type: 'varchar' })
  aho_name: string;

  @Column({ type: 'varchar' })
  aho_description: string;

  @Column({ type: 'varchar', nullable: true })
  aho_duration: string;

  @Column({ type: 'decimal' })
  aho_meta_quantity: number;

  @Column({ type: 'decimal' })
  aho_total_amount: number;

  @ManyToOne(() => Accounts, (account) => account.savings)
  @JoinColumn({
    name: 'fk_id_account',
    foreignKeyConstraintName: 'fk_account',
  })
  fk_id_account: Accounts;

  @OneToMany(() => Transactions, (transaction) => transaction.aho_id_fk)
  trasactions: Transactions[];
}
