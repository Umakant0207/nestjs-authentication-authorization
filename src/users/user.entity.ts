import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity('users') // creates a table named 'users' in SQLite
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique : true})
    email: string;

    @Column()
    password: string; // stores the bcrypt hash, never the plain text

    @Column({
        type: 'text',
        default: Role.USER // Everyone default to regular user
    })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;
}