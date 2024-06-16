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

@Entity('saving')
export class Savings {
  @PrimaryColumn({
    primaryKeyConstraintName: 'saving_pk',
  })
  saving_id: string;

  @Column({ type: 'varchar' })
  saving_name: string;

  @Column({ type: 'varchar' })
  saving_description: string;

  @Column({ type: 'varchar', nullable: true })
  saving_duration: string;

  @Column({ type: 'decimal' })
  saving_goal_quantity: number;

  @Column({ type: 'decimal' })
  saving_quantity_total: number;

  @ManyToOne(() => Accounts, (account) => account.savings)
  @JoinColumn({
    name: 'account_id_fk',
    foreignKeyConstraintName: 'account_fk',
  })
  account_id_fk: Accounts;

  @OneToMany(() => Transactions, (transaction) => transaction.saving_id_fk)
  trasactions: Transactions[];
}
