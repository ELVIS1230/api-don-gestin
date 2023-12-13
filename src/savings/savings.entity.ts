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
    primaryKeyConstraintName: 'ahorro_pk',
  })
  aho_id: string;

  @Column({ type: 'varchar' })
  aho_nombre: string;

  @Column({ type: 'varchar' })
  aho_descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  aho_duracion: string;

  @Column({ type: 'decimal' })
  aho_meta_cantidad: number;

  @Column({ type: 'decimal' })
  aho_cantidad_total: number;

  @ManyToOne(() => Accounts, (account) => account.savings)
  @JoinColumn({
    name: 'cuenta_id_fk',
    foreignKeyConstraintName: 'cuenta_fk',
  })
  cuenta_id_fk: Accounts;

  @OneToMany(() => Transactions, (transaction) => transaction.aho_id_fk)
  trasactions: Transactions[];
}
