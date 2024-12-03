// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Story } from './Story';

@Entity('epic')
export class Epic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.epicList, { nullable: false }) // Establish a Many-to-One relationship
  assignedTo: User; // Changed from createdBy to assignedTo

  @Column()
  content: string;

  @Column()
  title: string;


  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;

  stories? : Story[];
}