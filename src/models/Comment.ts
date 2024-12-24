import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Bug } from './Bug';
import { Story } from './Story';
import { Feature } from './Feature';
import { Epic } from './Epic';
import { User } from './User';
import { TodoTaskType, TodoSubTaskType } from '@/app/ui/todoCard/TodoCard.model';

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.comments, { nullable: true }) // Establish a Many-to-One relationship
      assignedTo: User; // Changed from createdBy to assignedTo

    @Column('text')
    content: string; // This will store the rich text as HTML

    @Column()
    formattedTaskId: string; // This will store the rich text as HTML

    @Column({ type: 'jsonb', nullable: true }) // Use jsonb to store an array of image URLs
    imageUrl?: string[]; // This will store the image URL if needed

    @Column({
        type: 'varchar', // Use varchar to store the string representation
        enum: [...Object.values(TodoTaskType), ...Object.values(TodoSubTaskType)], // Define allowed values
    })
    type: TodoTaskType | TodoSubTaskType;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @Column()
    taskId: number; // Foreign key for the task

    @ManyToOne(() => Bug, (bug) => bug.comments, { nullable: true })
    bug?: Bug;

    @ManyToOne(() => Epic, (epic) => epic.comments, { nullable: true })
    epic?: Epic;

    @ManyToOne(() => Story, (story) => story.comments, { nullable: true })
    story?: Story;

    @ManyToOne(() => Feature, (feature) => feature.comments, { nullable: true })
    feature?: Feature;
}