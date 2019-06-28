/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import validator from 'validator';
import jwt from 'jsonwebtoken';

import Helper from '../helpers/helper';
import pool from '../config';


const validate = {
  verifyInput(req, res, next) {
    const requiredFields = ['first_name', 'last_name', 'email', 'password'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(400).send({
        status: 400,
        error: 'The following field(s) is/are required',
        fields: missingFields,
      });
    }
    const {
      first_name, last_name, email, password,
    } = req.body;
    if (!validator.isAlpha(first_name) || !validator.isAlpha(last_name)
   || !validator.isLength(first_name, { min: 3 }) || !validator.isLength(last_name, { min: 3 })) {
      return res.status(400).send({
        status: 400,
        error: 'Your names can only be in alphabets and must contain atleast three characters',
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        status: 400,
        error: 'please enter a valid email address',
      });
    }
    if (!validator.isAlphanumeric(password) || !validator.isLength(password, { min: 8 })) {
      return res.status(400).send({
        status: 400,
        error: 'Your password must contain atleast 8 characters and must include atleast one number(symbols are not allowed)',
      });
    }
    pool.query('SELECT email FROM users WHERE email = $1 ', [email], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0]) {
        return res.status(409).send({
          status: 409,
          error: 'This email as already being used',
        });
      }
      next();
    });
  },
  verifySignin(req, res, next) {
    const { password, email } = req.body;
    if (password === undefined || email === undefined) {
      return res.status(400).send({
        status: 400,
        error: 'Email and password is required',
      });
    }
    if (validator.isEmpty(password) || validator.isEmpty(email)) {
      return res.status(400).send({
        status: 400,
        error: 'please provide email and password',
      });
    }
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
      if (error) {
        throw error;
      }
      if (!results.rows[0] || !Helper.comparePassword(results.rows[0].password, password)) {
        return res.status(404).send({
          status: 404,
          error: 'Email/password is incorrect',
        });
      }
      return next();
    });
  },
  verifyTrip(req, res, next) {
    const {
      bus_id, trip_date, fare, origin, destination,
    } = req.body;

    const requiredFields = ['bus_id', 'origin', 'destination', 'trip_date', 'fare'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(400).send({
        status: 400,
        error: 'The following field(s) is/are required',
        fields: missingFields,
      });
    }
    if (validator.isEmpty(origin) || validator.isEmpty(destination)) {
      return res.status(400).send({
        status: 400,
        error: 'origin/destination cannot be empty',
      });
    }
    // eslint-disable-next-line no-useless-escape
    if (!/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(trip_date) || validator.isEmpty(trip_date)) {
      return res.status(400).send({
        status: 400,
        error: 'Trip_date can only be a date',
      });
    }
    if (!Helper.isValidNumber(fare) || !Helper.isValidNumber(bus_id) || validator.isEmpty(fare)
     || validator.isEmpty(bus_id)) {
      return res.status(400).send({
        status: 400,
        error: 'Bus id and fare can only be a number',
      });
    }
    pool.query('SELECT id FROM bus WHERE id = $1', [bus_id], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 404,
          error: 'Bus not found',
        });
      }
      pool.query('SELECT bus_id FROM trips WHERE bus_id = $1', [bus_id], (err, result) => {
        if (result.rows[0]) {
          return res.status(409).send({
            status: 409,
            error: 'Bus already assigned to a trip',
          });
        }
        return next();
      });
    });
  },
  verifyBook(req, res, next) {
    const trip_id = parseInt(req.body.trip_id);
    if (trip_id === undefined || !trip_id || !Helper.isValidNumber(trip_id)) {
      return res.status(400).send({
        status: 400,
        error: 'trip_id is valid and can only be a number',
      });
    }
    pool.query('SELECT id, status FROM trips WHERE id =$1', [trip_id], (err, results) => {
      if (!results.rows[0] || results.rows[0].status !== 'active') {
        return res.status(404).send({
          status: 404,
          error: 'Trip not Active',
        });
      }
      return next();
    });
  },
  verifyDel(req, res, next) {
    const decoded = jwt.decode(req.headers['x-access-token'], { complete: true });
    const { bookingId } = req.params;
    if (!Helper.isValidNumber(bookingId)) {
      return res.status(400).send({
        status: 400,
        error: 'params can only be a number',
      });
    }
    pool.query('SELECT * FROM bookings WHERE user_id =$1 AND id =$2', [decoded.payload.userId, bookingId], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 404,
          error: 'booking not found',
        });
      }
      return next();
    });
  },
  verifyCancel(req, res, next) {
    const { tripId } = req.params;
    if (!Helper.isValidNumber(tripId)) {
      return res.status(400).send({
        status: 400,
        error: 'params can only be a number',
      });
    }
    pool.query('SELECT * FROM trips WHERE id =$1', [tripId], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 404,
          error: 'Trip not found',
        });
      }
      return next();
    });
  },
};
export default validate;
