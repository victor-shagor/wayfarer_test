import pool from '../config';
import Helper from '../helpers/helper';

const password = Helper.hashPassword('oladimeji1');
const password1 = Helper.hashPassword('adedoyin1');

const populate = `
INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES ('abiola','victor','ojoabiola@gmail.com','${password}',true);
INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES ('doyin','adedokun','doyin@gmail.com','${password1}',false);
INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES ('EKY380A','Honda','DL360', 2016, 20);
INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES ('EKY380B','Honda','DL360', 2016, 20);
INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES ('EKY380C','Honda','DL360', 2016, 20);
INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES ('EKY380D','Honda','DL360', 2016, 20);
INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES ('EKY380E','Honda','DL360', 2016, 20);
`;

const seedDatabase = async () => {
  await pool.query(populate).then(() => {
    console.log('tables Successfully populated');
  });
};

seedDatabase();
