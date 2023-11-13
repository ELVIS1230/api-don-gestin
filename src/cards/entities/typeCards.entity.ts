import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from '../cards.entity';

@Entity('tipo_tarjetas')
export class TypeCards {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'tipo_tarjetas_pk' })
  tiptarj_id: number;

  @Column({ type: 'varchar', length: '25' })
  tiptarj_tipo: string;

  @OneToMany(() => Cards, (card) => card.tiptarj_id_fk)
  cards: Cards[];
}
