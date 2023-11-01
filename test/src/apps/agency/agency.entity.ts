import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Agency')
export class AgencyEntity {
  @PrimaryGeneratedColumn('increment')
  agencyId: number;
  @Column()
  name: string;
  @Column()
  phone: string;
}
