import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeTrasanctions } from './type-transactions.entity';
import { Accounts } from 'src/users/accounts.entity';

@Entity('trasacciones')
export class Transactions {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'trasacciones_pk',
    type: 'integer',
  })
  trasac_id: number;

  @Column()
  trasac_nombre: string;

  @Column()
  trasac_descripcion: string;

  @Column({ type: 'decimal' })
  trasac_cantidad: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // @Column()
  // tipo_trasanccionID: number;

  @ManyToOne(
    () => TypeTrasanctions,
    (typeTrasancions) => typeTrasancions.transactions,
  )
  @JoinColumn({ name: 'ttrac_id_fk', foreignKeyConstraintName: 'ttrac_id_fk' })
  ttrac_id_fk: number;

  @ManyToOne(() => Accounts, (account) => account.transactions)
  @JoinColumn({
    name: ' cuenta_id_fk',
    foreignKeyConstraintName: 'cuenta_id_fk',
  })
  cuenta_id_fk: string;
}
