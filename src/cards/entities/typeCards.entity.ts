import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from '../cards.entity';

@Entity('card_type')
export class TypeCards {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'card_type_pk' })
  tiptarj_id: number;

  @Column({ type: 'varchar', length: '25' })
  tiptarj_type: string;

  @OneToMany(() => Cards, (card) => card.tiptarj_id_fk)
  cards: Cards[];
}
