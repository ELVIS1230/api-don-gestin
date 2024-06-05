import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from '../cards.entity';

@Entity('types_cards')
export class TypeCards {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'type_card_pk' })
  typecard_id: number;

  @Column({ type: 'varchar', length: '25' })
  typecard_type: string;

  @OneToMany(() => Cards, (card) => card.typecard_id_fk)
  cards: Cards[];
}
