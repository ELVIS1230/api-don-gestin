import { Transactions } from 'src/transactions/transactions.entity';
import { Accounts } from 'src/users/accounts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ahorros')
export class Savings {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'ahorro_pk',
  })
  aho_id: string;

  @Column({ type: 'varchar' })
  aho_nombre: string;

  @Column({ type: 'varchar' })
  aho_descripcion: string;

  @Column({ type: 'decimal' })
  aho_cantidad: number;

  @ManyToOne(() => Accounts, (acount) => acount.savings)
  @JoinColumn({
    name: 'cuenta_id_fk',
    foreignKeyConstraintName: 'cuenta_fk',
  })
  cuenta_id_fk: Accounts;

  @OneToMany(() => Transactions, (transaction) => transaction.aho_id_fk)
  trasacciones: Transactions;
}
