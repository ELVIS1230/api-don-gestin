import { Transactions } from 'src/transactions/transactions.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('cuentas')
export class Accounts {
  // @Column({ unique: true })
  @PrimaryColumn({ primaryKeyConstraintName: 'cuenta_id_pk' })
  cuenta_id: string;

  @Column({ type: 'decimal', default: () => '00.00' })
  cuenta_saldo: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Transactions, (transaction) => transaction.cuenta_id_fk)
  transactions: Transactions[];
}
