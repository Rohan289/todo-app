// typeorm.ts
import { Todo } from '@/app/models/Todo';
import { User } from '@/app/models/User';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',  // replace with your PostgreSQL username
  password: '1032',  // replace with your PostgreSQL password
  database: 'collaborative-todo',  // replace with your PostgreSQL database name
  synchronize: true, // auto-sync entity schema with the database
  logging: false,
  entities: [Todo,User],
  migrations: [],
  subscribers: [],
});

// Function to initialize the database connection
export const initializeDb = async () => {
  if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
  }
};
