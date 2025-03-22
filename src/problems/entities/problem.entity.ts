import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Difficulty } from '../enums/difficulty.enum';
import { Testcase } from './testcase.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  index: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  defaultCode: string;

  @Column()
  templateRunning: string;

  @Column()
  solution: string;

  @Column({ type: 'enum', enum: Difficulty })
  difficulty: Difficulty;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Testcase, (testcase) => testcase.problem, {
    cascade: true,
    eager: true,
  })
  testcases: Testcase[];
}
