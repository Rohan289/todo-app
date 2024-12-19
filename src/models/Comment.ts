import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userEmail  :string;

    @Column('text')
    content: string; // This will store the rich text as HTML

    @Column({ nullable: true }) // Make this nullable if not every comment will have an image
    imageUrl: string; // This will store the image URL if needed

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}