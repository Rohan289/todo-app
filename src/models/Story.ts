// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Feature } from 'typeorm';
import { User } from './User';
import { Epic } from './Epic';
import { TodoStatus } from '@/app/ui/todoCard/TodoCard.model';
import { Bug } from './Bug';

@Entity('story')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default : null }) 
  formattedId: string; // New field for formatted ID

  @ManyToOne(() => User, (user) => user.storyList, { nullable: false }) // Establish a Many-to-One relationship
  assignedTo: User; // Changed from createdBy to assignedTo

  @ManyToOne(() => Epic, (epic) => epic.stories, { nullable: false }) // Establish a Many-to-One relationship
  epic: Epic; 

  @Column()
  content: string;

  @Column({
    type: 'varchar', // Specify the type as varchar
    enum: TodoStatus, // Inform TypeORM about the enum
    default: TodoStatus.OPEN, // Set a default value if needed
  })
  status?: string;


  @Column()
  title: string;


  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;

  bugs? : Bug[];

  features? : Feature[];

}