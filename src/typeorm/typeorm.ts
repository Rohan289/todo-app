// typeorm.ts
import { Todo } from '@/models/Todo';
import { User } from '@/models/User';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Epic } from '@/models/Epic';
import { Story } from '@/models/Story';
import { Bug } from '@/models/Bug';
import { Feature } from '@/models/Feature';

dotenv.config();

const {DATABASE_NAME,DATABASE_HOST,DATABASE_PORT,DATABASE_USER,DATABASE_PASSWORD} = process.env;

console.log('DB**********************',DATABASE_NAME,DATABASE_HOST,DATABASE_PORT,DATABASE_USER,DATABASE_PASSWORD);
export const AppDataSource = new DataSource({
  // ssl: {
  //   rejectUnauthorized: false, // Allows self-signed certificates; not recommended for production
  // },
  // url: process.env.DATABASE_URL,
  type: 'postgres',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT as string),
  username: DATABASE_USER,  // replace with your PostgreSQL username
  password: DATABASE_PASSWORD,  // replace with your PostgreSQL password
  database: DATABASE_NAME,  // replace with your PostgreSQL database name
  synchronize: true, // auto-sync entity schema with the database
  logging: false,
  entities: [Todo,User,Epic,Story,Bug,Feature],
  migrations: [],
  subscribers: [],
});

// Function to initialize the database connection
export const initializeDb = async () => {
  if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
  }
};
