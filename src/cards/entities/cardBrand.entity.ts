import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from '../cards.entity';

@Entity('brands_cards')
export class CardsBrands {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'marca_cards_pk' })
  bcard_id: number;

  @Column({ type: 'varchar', length: '25' })
  bcard_name: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  bcard_logo: string;

  @Column({ type: 'varchar', length: '10' })
  bcard_color: string;

  @OneToMany(() => Cards, (card) => card.bcard_id_fk)
  cards: Cards[];
}
