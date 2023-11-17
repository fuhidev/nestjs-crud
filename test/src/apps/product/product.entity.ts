import { GeoJSON } from 'nest-crud-server';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GeometryColumn } from '../../../../packages/crud/dist';
import { AgencyEntity } from '../agency/agency.entity';
import { DistrictEntity } from '../district/district.entity';

@Entity({ name: 'Product' })
export class ProductEntity {
  @PrimaryColumn({ generated: 'increment' })
  productId: number;
  @Column()
  title: string;
  @Column({ nullable: true })
  avatarId: string;
  @Column({ nullable: true })
  address: string;
  @Column({ default: '$0.00', type: 'money' })
  price: number;

  @Column({ default: 0 })
  area: number;
  @Column({ nullable: true })
  bedNum?: number;
  @Column({ nullable: true })
  bathNum?: number;
  @Column()
  description: string;

  @CreateDateColumn() createDate: Date;
  @UpdateDateColumn() updateDate: Date;

  @Column({ default: false })
  trending: boolean;

  @Column({ nullable: true })
  agencyId: number;
  @JoinColumn({ name: 'agencyId' })
  @ManyToOne(() => AgencyEntity, (e) => e.agencyId, { onDelete: 'SET NULL' })
  agency: AgencyEntity;

  @Column({ nullable: true, type: 'money' }) priceTo: number;
  @Column({ nullable: true }) areaTo: number;
  @Column({ nullable: true }) roomNum: number;

  @Column({ nullable: true }) districtId: string;
  @JoinColumn({ name: 'districtId' })
  @ManyToOne(() => DistrictEntity, { onDelete: 'SET NULL' })
  district: DistrictEntity;
  @Column({ nullable: true }) location: string;

  @GeometryColumn({ nullable: true })
  shape: GeoJSON.Point;
}
