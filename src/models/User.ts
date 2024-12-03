// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Feature } from 'typeorm';
import { Todo } from './Todo';
import { Epic } from './Epic';
import { Story } from './Story';
import { Bug } from './Bug';
  
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;

  todoList: Todo[];

  epicList : Epic[];

  storyList : Story[];

  bugList : Bug[];

  featureList : Feature[];

}
