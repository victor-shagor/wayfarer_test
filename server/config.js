import dotenv from 'dotenv';
import { Pool, types } from 'pg';


dotenv.config();
types.setTypeParser(1700, value => parseFloat(value));

const connectionString = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

export default pool;
