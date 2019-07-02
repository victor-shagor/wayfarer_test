import pool from '../config';


const dropTables = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS bus CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

`;

const dropDatabase = async () => {
  await pool.query(dropTables).then(() => {
    console.log('Tables successfully removed from Database');
  });
};

dropDatabase();
