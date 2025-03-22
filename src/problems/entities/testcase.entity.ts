import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Problem } from './problem.entity';

@Entity('testcases')
export class Testcase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  input: string;

  @Column({ default: false })
  isSample: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Problem, (problem) => problem.testcases)
  problem: Problem;
}
