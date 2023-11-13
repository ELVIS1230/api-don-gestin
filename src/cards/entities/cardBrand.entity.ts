import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cards } from '../cards.entity';

@Entity('marca_tarjetas')
export class CardsBrands {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'marca_tarjetas_pk' })
  mtarj_id: number;

  @Column({ type: 'varchar', length: '25' })
  mtarj_nombre: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  mtarj_logo: string;

  @Column({ type: 'varchar', length: '10' })
  mtarj_color: string;

  @OneToMany(() => Cards, (card) => card.mtarj_id_fk)
  cards: Cards[];
}
