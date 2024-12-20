import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Bug } from './Bug';
import { Story } from './Story';
import { Feature } from './Feature';
import { Epic } from './Epic';

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userEmail:string;

    @Column('text')
    content: string; // This will store the rich text as HTML

    @Column({ nullable: true }) // Make this nullable if not every comment will have an image
    imageUrl?: string[]; // This will store the image URL if needed

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Bug || Epic || Story || Feature, (task: Bug | Epic | Story | Feature) => task.comments) // Establish a Many-to-One relationship
    task: Bug | Epic | Story | Feature;
}