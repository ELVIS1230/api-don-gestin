import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TypeCards } from './entities/typeCards.entity';
import { CardsBrands } from './entities/cardBrand.entity';
import { Accounts } from 'src/users/accounts.entity';
import { Transactions } from 'src/transactions/transactions.entity';

@Entity('tarjetas')
export class Cards {
  @PrimaryColumn({
    primaryKeyConstraintName: 'tarjetas_pk',
    type: 'varchar',
    length: 9,
  })
  tarj_id: string;

  @Column({ type: 'varchar', length: '25' })
  tarj_nombre: string;

  @Column({ type: 'varchar', length: '75' })
  tarj_descripcion: string;

  @Column({ type: 'decimal', nullable: true })
  tarj_cupo: number;

  @Column({ type: 'decimal' })
  tarj_saldo_total: number;

  @Column({ type: 'decimal', nullable: true })
  tarj_saldo_pagar: number;

  @Column({ type: 'date', nullable: true })
  tarj_fecha_corte: Date;

  @Column({ type: 'date', nullable: true })
  tarj_fecha_vencimiento: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => TypeCards, (typeCard) => typeCard.cards)
  @JoinColumn({ foreignKeyConstraintName: 'tiptarj_fk', name: 'tiptarj_id_fk' })
  tiptarj_id_fk: TypeCards;

  @ManyToOne(() => CardsBrands, (cardBrand) => cardBrand.cards)
  @JoinColumn({ foreignKeyConstraintName: 'mtarj_fk', name: 'mtarj_id_fk' })
  mtarj_id_fk: CardsBrands;

  @ManyToOne(() => Accounts, (account) => account.cards)
  @JoinColumn({ foreignKeyConstraintName: 'cuenta_fk', name: 'cuenta_id_fk' })
  cuenta_id_fk: Accounts;

  @OneToMany(() => Accounts, (account) => account.cards)
  transactions: Transactions;
}
