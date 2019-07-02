/* eslint-disable radix */
/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';

import pool from '../config';

const trip = {
  create(req, res) {
    const { origin, destination, trip_date } = req.body;
    const fare = parseInt(req.body.fare);
    const bus_id = parseInt(req.body.bus_id);
    pool.query('INSERT INTO trips (bus_id, origin, destination, trip_date, fare, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id', [bus_id, origin, destination, trip_date, fare, 'active'], (error, result) => {
      if (error) {
        throw error;
      }
      const { id } = result.rows[0];
      const data = {
        trip_id: id,
        bus_id,
        origin,
        destination,
        trip_date,
        fare,
      };
      res.status(201).send({
        status: 201,
        data,
      });
    });
  },
  getTrips(req, res) {
    pool.query('SELECT * FROM trips', (error, results) => {
      if (error) {
        throw error;
      }
      return res.status(200).send({
        status: 200,
        data: results.rows,
      });
    });
  },
  book(req, res) {
    const decoded = jwt.decode(req.headers['x-access-token'], { complete: true });
    const created_on = new Date();
    const { trip_id, seat_number } = req.body;
    const { userId } = decoded.payload;
    pool.query('SELECT id, bus_id, trip_date FROM trips WHERE id =$1', [trip_id], (err, results) => {
      const { bus_id, trip_date } = results.rows[0];

      pool.query('SELECT * FROM users WHERE id =$1', [userId], (errr, user) => {
        const { first_name, last_name, email } = user.rows[0];

        pool.query('INSERT INTO bookings (trip_id, user_id, bus_id, trip_date, seat_number, first_name, last_name, email, status, created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id', [trip_id, userId, bus_id, trip_date, seat_number, first_name, last_name, email, 'active', created_on], (error, result) => {
          if (error) {
            throw error;
          }
          const { id } = result.rows[0];

          const data = {
            booking_id: id,
            user_id: userId,
            trip_id,
            bus_id,
            trip_date,
            seat_number,
            first_name,
            last_name,
            email,
            status: 'active',
          };
          return res.status(201).send({
            status: 201,
            data,
          });
        });
      });
    });
  },
  getBookings(req, res) {
    const decoded = jwt.decode(req.headers['x-access-token'], { complete: true });
    if (decoded.payload.isadmin === true) {
      pool.query('SELECT * FROM bookings', (error, results) => res.status(200).send({
        status: 200,
        data: results.rows,
      }));
    }
    if (decoded.payload.isadmin !== true) {
      pool.query('SELECT * FROM bookings WHERE user_id =$1', [decoded.payload.userId], (error, results) => res.status(200).send({
        status: 200,
        data: results.rows,
      }));
    }
  },
  deleteBookings(req, res) {
    const id = parseInt(req.params.bookingId);
    const decoded = jwt.decode(req.headers['x-access-token'], { complete: true });
    pool.query('DELETE FROM bookings WHERE user_id =$1 AND id =$2', [decoded.payload.userId, id], () => {
      res.status(200).send({
        status: 200,
        message: 'Booking deleted successfully',
      });
    });
  },
  cancelTrip(req, res) {
    const id = parseInt(req.params.tripId);
    pool.query('UPDATE trips SET status = $1 WHERE id = $2', ['cancelled', id], () => {
      pool.query('UPDATE bookings SET status = $1 WHERE trip_id = $2', ['cancelled', id], () => {
        res.status(200).send({
          status: 200,
          message: 'Trip cancelled successfully',
        });
      });
    });
  },
  getFilterTrips(req, res) {
    const { origin } = req.body;
    const { destination } = req.body;
    if (origin) {
      pool.query('SELECT * FROM trips WHERE origin =$1', [origin], (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send({
          status: 200,
          data: results.rows,
        });
      });
    }
    if (destination) {
      pool.query('SELECT * FROM trips WHERE destination =$1', [destination], (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send({
          status: 200,
          data: results.rows,
        });
      });
    }
  },
};
export default trip;
