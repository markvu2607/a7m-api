import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('testcases')
export class Testcase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  input: string;

  @Column()
  output: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
