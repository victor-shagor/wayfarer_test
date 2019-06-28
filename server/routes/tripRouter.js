import express from 'express';

import trip from '../controllers/trips';
import validate from '../middleware/validations';
import Auth from '../middleware/auth';


const tripRouter = express.Router();

const {
  verifyTrip, verifyBook, verifyDel, verifyCancel,
} = validate;
const {
  create, getTrips, book, getBookings, deleteBookings, cancelTrip,
} = trip;
const { verifyAdmin, verifyToken } = Auth;


tripRouter.route('/api/v1/trips').post(verifyTrip, verifyAdmin, create);
tripRouter.route('/api/v1/trips').get(verifyAdmin, getTrips);
tripRouter.route('/api/v1/bookings').post(verifyBook, verifyToken, book);
tripRouter.route('/api/v1/bookings').get(verifyToken, getBookings);
tripRouter.route('/api/v1/bookings/:bookingId').delete(verifyDel, verifyToken, deleteBookings);
tripRouter.route('/api/v1/trips/:tripId').patch(verifyCancel, verifyAdmin, cancelTrip);


export default tripRouter;
