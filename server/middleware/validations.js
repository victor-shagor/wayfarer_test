/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import validator from 'validator';
import jwt from 'jsonwebtoken';

import Helper from '../helpers/helper';
import pool from '../migrations/config';


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
          status: 'error',
          error: 'The following field(s) is/are required',
          fields: missingFields,
        });
      }
      const {
        first_name, last_name, email, password,
      } = req.body;
      if (!validator.isAlpha(first_name) || !validator.isAlpha(last_name)) {
        return res.status(401).send({
          status: 'error',
          error: 'Your names can only be in alphabets',
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).send({
          status: 'error',
          error: 'please enter a valid email address',
        });
      }
      if (!password || !validator.isLength({min:5})) {
        return res.status(404).send({
          status: 'error',
          error: 'Your password cannot be empty',
        });
      }
    pool.query('SELECT email FROM users WHERE email = $1 ', [email], (error, results) => {
      if (results.rows[0]) {
        return res.status(409).send({
          status: 'error',
          error: 'This email has already being used',
        });
      }
      next();
    });
  },
  verifySignin(req, res, next) {
    const { password, email } = req.body;
    if (password === undefined || email === undefined) {
      return res.status(400).send({
        status: 'error',
        error: 'Email and password is required',
      });
    }
    if (validator.isEmpty(password) || validator.isEmpty(email)) {
      return res.status(400).send({
        status: 'error',
        error: 'please provide email and password',
      });
    }
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
      if (!results.rows[0] || !Helper.comparePassword(results.rows[0].password, password)) {
        return res.status(400).send({
          status: 'error',
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
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const requiredFields = ['bus_id', 'origin', 'destination', 'trip_date', 'fare'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(401).send({
        status: 'error',
        error: 'The following field(s) is/are required',
        fields: missingFields,
      });
    }
    if (!validator.isAlphanumeric(origin) || !validator.isAlphanumeric(destination)) {
      return res.status(402).send({
        status: 'error',
        error: 'origin/destination cannot be empty',
      });
    }
    
    if (!validator.isISO8601(trip_date)) {
      return res.status(403).send({
        status: 'error',
        error: 'Trip_date can only be a date in MM/DD/YYYY format',
      });
    }
    if (!/^\d*\.?\d*$/.test(fare) || !Helper.isValidNumber(bus_id) || fare < 1) {
      return res.status(404).send({
        status: 'error',
        error: 'Bus id and fare can only be a number',
      });
    }
    pool.query('SELECT id FROM bus WHERE id = $1', [bus_id], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: `Bus with id:${bus_id} not found`,
        });
      }
      pool.query('SELECT bus_id FROM trips WHERE bus_id = $1', [bus_id], (err, result) => {
        if (result.rows[0]) {
          return res.status(409).send({
            status: 'error',
            error: `Bus with id:${bus_id} already assigned to a trip`,
          });
        }
        return next();
      });
    });
  },
  verifyGet(req, res, next) {
    pool.query('SELECT * FROM trips', (err, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'No trip Available',
        });
      }
      return next();
    });
  },
  verifyBook(req, res, next) {
    const decoded = jwt.decode(req.headers['token'], { complete: true });
    const seat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const { trip_id, seat_number } = req.body;
    if (!trip_id || !Helper.isValidNumber(trip_id)) {
      return res.status(400).send({
        status: 'error',
        error: 'trip_id can only be a number',
      });
    }
    // if (!seat_number || seat_number > 20 || !Helper.isValidNumber(seat_number)) {
    //   return res.status(400).send({
    //     status: 'error',
    //     error: 'seat_number can only be a number and cannot be more than 20',
    //   });
    // }
    pool.query('SELECT id, status FROM trips WHERE id =$1', [trip_id], (err, results) => {
      if (!results.rows[0] || results.rows[0].status !== 'active') {
        return res.status(404).send({
          status: 'error',
          error: 'Trip not found/Active',
        });
      }
      pool.query('SELECT * FROM bookings WHERE user_id =$1', [decoded.payload.user_id], (error, result) => {
        let test;
        result.rows.forEach((trips) => {
          if (trips.trip_id === parseInt(trip_id)) {
            test = false;
          }
        });
        if (test === false) {
          return res.status(400).send({
            status: 'error',
            error: 'Trip already booked by you',
          });
          }
        // pool.query('SELECT seat_number FROM bookings where trip_id =$1', [trip_id], (errr, resul) => {
        //   let testing;
        //   resul.rows.forEach((seats) => {
        //     for (let i = 0; i < seat.length; i++) {
        //       if (seat[i] === seats.seat_number) {
        //         seat.splice(i, 1);
        //       }
        //     }
        //     if (parseInt(seat_number) === seats.seat_number) {
        //       testing = false;
        //     }
        //   });
        //   if (testing === false) {
        //     return res.status(409).send({
        //       status: 'error',
        //       error: `Seat taken, seats available are ${seat}`,
        //     });
        //   }
          next();
        });
      });
  },
  verifyDel(req, res, next) {
    const decoded = jwt.decode(req.headers['token'], { complete: true });
    const { bookingId } = req.params;
    if (!Helper.isValidNumber(bookingId)) {
      return res.status(400).send({
        status: 'error',
        error: 'id can only be a number',
      });
    }
    pool.query('SELECT * FROM bookings WHERE user_id =$1 AND id =$2', [decoded.payload.user_id, bookingId], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'booking not on your booking list',
        });
      }
      return next();
    });
  },
  verifyCancel(req, res, next) {
    const { tripId } = req.params;
    if (!Helper.isValidNumber(tripId)) {
      return res.status(400).send({
        status: 'error',
        error: 'id can only be a number',
      });
    }
    pool.query('SELECT id, status FROM trips WHERE id =$1', [tripId], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'Trip not found',
        });
      }
      if (results.rows[0].status === 'cancelled') {
        return res.status(409).send({
          status: 'error',
          error: 'Trip already cancelled',
        });
      }
      return next();
    });
  },
  verifyFilter(req, res, next) {
    const { origin } = req.body;
    const { destination } = req.body;
    if (!origin && !destination) {
      return res.status(400).send({
        status: 'error',
        error: 'Either origin or destination is required to filter',
      });
    }
    if (origin && destination) {
      return res.status(400).send({
        status: 'error',
        error: 'you can only filter with either origin or destination but not both',
      });
    }
    if (origin) {
      pool.query('SELECT * FROM trips WHERE origin =$1', [origin], (error, results) => {
        if (!results.rows[0]) {
          return res.status(404).send({
            status: 'error',
            error: `There no trips from ${origin}`,
          });
        }
        next();
      });
    }
    if (destination) {
      pool.query('SELECT * FROM trips WHERE destination =$1', [destination], (error, result) => {
        if (!result.rows[0]) {
          return res.status(404).send({
            status: 'error',
            error: `There no trips going to ${destination}`,
          });
        }
        next();
      });
    }
  },
};
export default validate;
