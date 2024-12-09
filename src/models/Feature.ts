// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Story } from './Story';
import { TodoPriority, TodoStatus } from '@/app/ui/todoCard/TodoCard.model';

@Entity('feature')
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default : null }) 
  formattedId: string; // New field for formatted ID

  @ManyToOne(() => User, (user) => user.featureList, { nullable: true }) // Establish a Many-to-One relationship
  assignedTo: User; // Changed from createdBy to assignedTo

  @Column()
  content: string;

  @Column()
  title: string;

  @Column({
    type: 'varchar', // Specify the type as varchar
    enum: TodoStatus, // Inform TypeORM about the enum
    default: TodoStatus.OPEN, // Set a default value if needed
  })
  status?: string;

  @Column({
    type: 'varchar', // Specify the type as varchar
    enum: TodoPriority, // Inform TypeORM about the enum
    default: TodoPriority.LOW, // Set a default value if needed
  })
  priority: string;

  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;


  @ManyToOne(() => Story, (story) => story.features, { nullable: true }) // Establish a Many-to-One relationship
  story: Story; 
}