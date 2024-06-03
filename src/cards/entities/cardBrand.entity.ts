import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from '../cards.entity';

@Entity('card_brand')
export class CardsBrands {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'card_brand_pk' })
  mtarj_id: number;

  @Column({ type: 'varchar', length: '25' })
  mtarj_name: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  mtarj_logo: string;

  @Column({ type: 'varchar', length: '10' })
  mtarj_color: string;

  @OneToMany(() => Cards, (card) => card.mtarj_id_fk)
  cards: Cards[];
}
