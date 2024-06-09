import { Pool } from 'pg';

const db = new Pool({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PWD!,
  database: process.env.DATABASE_NAME!,
  port: parseInt(process.env.DATABASE_PORT!),
});

export default db;
