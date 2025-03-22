import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  problemId: string;

  @Column()
  userId: string;

  @Column()
  code: string;

  @Column()
  status: string;

  @Column()
  language: string;

  @Column({ nullable: true })
  testcaseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
