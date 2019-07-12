/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  isValidPassword(password) {
    return /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,100}$/.test(password);
  },
  isValidNumber(number) {
    return /^\d+$/.test(number);
  },
  generateToken(user_id, email, is_admin) {
    const token = jwt.sign({
      user_id,
      email,
      is_admin,
    },
    process.env.SECRET, { expiresIn: '7d' });
    return token;
  },
};

export default Helper;
