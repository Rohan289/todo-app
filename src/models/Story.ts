// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Epic } from './Epic';

@Entity('story')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.storyList, { nullable: false }) // Establish a Many-to-One relationship
  assignedTo: User; // Changed from createdBy to assignedTo

  @ManyToOne(() => Epic, (epic) => epic.stories, { nullable: false }) // Establish a Many-to-One relationship
  epic: Epic; 

  @Column()
  content: string;

  @Column()
  title: string;


  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;
}