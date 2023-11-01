import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Post' })
export class PostEntity {
  @PrimaryColumn({ generated: 'increment' })
  postId: number;
  @Column()
  title: string;
  avatarSrc: string;
  @Column({ default: '' })
  description: string;
  @Column({ default: '' })
  shortDescription: string;

  @CreateDateColumn() createDate: Date;
  @UpdateDateColumn() updateDate: Date;
}
