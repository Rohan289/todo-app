// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { TodoPriority, TodoStatus } from '../app/ui/todoCard/TodoCard.model';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.todoList, { nullable: false }) // Establish a Many-to-One relationship
  createdBy: User;
       
  @Column()
  content: string;

  @Column()
  title : string;
  @Column({
    type: 'varchar', // Specify the type as varchar
    enum: TodoStatus, // Inform TypeORM about the enum
    default: TodoStatus.OPEN, // Set a default value if needed
})
  status? : string;

  @Column({
    type: 'varchar', // Specify the type as varchar
    enum: TodoPriority, // Inform TypeORM about the enum
    default: TodoPriority.LOW, // Set a default value if needed
})
  priority : string;

  @Column({
    type: 'text',
    array: true,
    default: () => 'ARRAY[]::text[]', // Default to an empty array
  })
  comments?: string[];

  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record creation
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Automatically sets the time of record update
  updatedAt!: Date;

}
