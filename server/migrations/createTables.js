import pool from '../config';

const createTables = `
  CREATE TABLE IF NOT EXISTS users (
   ID SERIAL PRIMARY KEY,
   email VARCHAR,
   first_name VARCHAR(20),
   last_name VARCHAR(20),
   password VARCHAR,
   is_admin BOOLEAN
  );
  CREATE TABLE IF NOT EXISTS bus (
   ID SERIAL PRIMARY KEY,
   number_plate VARCHAR,
   manufacturer VARCHAR,
   model VARCHAR,
   year INT,
   capacity INT
  );
  CREATE TABLE IF NOT EXISTS trips (
   ID SERIAL PRIMARY KEY,
   bus_id INT,
   origin VARCHAR,
   destination VARCHAR,
   trip_date DATE,
   fare FLOAT,
   status VARCHAR
  );
  CREATE TABLE IF NOT EXISTS bookings (
   ID SERIAL PRIMARY KEY,
   trip_id INT,
   user_id INT,
   created_on TIMESTAMP
  );
`;

const createDatabaseTables = async () => {
  await pool.query(createTables).then(() => {
    console.log('Tables successfully created');
  });
};

createDatabaseTables();
