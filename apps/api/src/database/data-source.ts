import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { UserEntity } from '../users/user.entity';

dotenv.config({ path: path.resolve(__dirname, `../../.env`) });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'my_management_system',
  entities: [UserEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
