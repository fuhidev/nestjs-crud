import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Legal')
export class LegalEntity {
  @PrimaryGeneratedColumn('increment')
  legalId: number;
  @Column({ default: '' }) title: string;
  @Column({ default: '' }) description: string;
}
