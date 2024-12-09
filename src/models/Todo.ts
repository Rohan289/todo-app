// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { TodoPriority, TodoStatus } from '../app/ui/todoCard/TodoCard.model';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.todoList, { nullable: true }) // Establish a Many-to-One relationship
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

  @Column({
    type: 'jsonb', // Use jsonb to store an array of objects
    default: () => "'[]'", // Default to an empty JSON array
  })
  comments?: { userEmail: string; commentText: string }[]; // Define the new type

  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;
}