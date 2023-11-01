import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District')
export class DistrictEntity {
  @PrimaryColumn() districtId: string;
  @Column() name: string;
  @Column({ default: 0 }) numbering: number;
}
