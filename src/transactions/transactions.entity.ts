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

  @Column({ type: 'decimal' })
  trasac_saldo: number;

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
    name: 'cuenta_id_fk',
    foreignKeyConstraintName: 'cuenta_fk',
  })
  cuenta_id_fk: Accounts;

  @ManyToOne(() => Cards, (card) => card.transactions)
  @JoinColumn({
    name: 'tarj_id_fk',
    foreignKeyConstraintName: 'tarj_fk',
  })
  tarj_id_fk: Cards;

  @ManyToOne(() => Savings, (saving) => saving.trasacciones)
  @JoinColumn({
    name: 'aho_id_fk',
    foreignKeyConstraintName: 'aho_fk',
  })
  aho_id_fk: Savings;
}
