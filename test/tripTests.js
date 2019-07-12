/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();


describe('trips', () => {
  let token;
  it('should login admin', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'ojoabiola@gmail.com', password: 'oladimeji1',
      })
      .end((err, res) => {
        // eslint-disable-next-line prefer-destructuring
        token = res.body.data.token;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('first_name');
        res.body.data.should.have.property('last_name');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('is_admin');
        res.body.data.should.have.property('token');
        done();
      });
  });
  let token1;
  it('should login admin', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'doyin@gmail.com', password: 'adedoyin1',
      })
      .end((err, res) => {
        // eslint-disable-next-line prefer-destructuring
        token1 = res.body.data.token;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('first_name');
        res.body.data.should.have.property('last_name');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('is_admin');
        res.body.data.should.have.property('token');
        done();
      });
  });
  it('should not get any trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should create a trip', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'kaduna', trip_date: '06/06/2020', fare: '2000',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('trip_id');
        res.body.data.should.have.property('bus_id');
        res.body.data.should.have.property('origin');
        res.body.data.should.have.property('destination');
        res.body.data.should.have.property('trip_date');
        res.body.data.should.have.property('fare')
        done();
      });
  });
  it('should not create a trip without the required fields', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        origin: 'ojo', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without bus id', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '', origin: 'ojo', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without bus id', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'ojo', destination: '[]/', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without origin', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: '', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without destination', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'ojo', destination: '', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without trip date', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip with wrong trip date format', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '20/02/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip with past trip date ', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '02/02/2004', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without fare', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip when bus id is not a number', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: 're', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip when bus id is not in the database', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '20', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip with a bus already on a trip', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip without a token', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': '',
      })
      .send({
        bus_id: '3', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip with a wrong token', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': '123ed',
      })
      .send({
        bus_id: '3', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip with a non admin token', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'token': token1,
      })
      .send({
        bus_id: '3', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2020', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should get all trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });
  it('should not get all trips without token', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set({
        'token':'',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not get all trips with a wrong token', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set({
        'token':'jjshghs23',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should book a trip', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token,
      })
      .send({
        trip_id: '1', seat_number: '1',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('trip_id');
        res.body.data.should.have.property('bus_id');
        res.body.data.should.have.property('trip_date');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('first_name');
        res.body.data.should.have.property('last_name');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('created_on');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('booking_id');
        res.body.data.should.have.property('seat_number');
        done();
      });
  });
  it('should not book a trip twice', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token,
      })
      .send({
        trip_id: '1', seat_number: '1',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not book a trip with allocated seat', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token1,
      })
      .send({
        trip_id: '1', seat_number: '1',
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not book a trip without seat number', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token,
      })
      .send({
        trip_id: '1', seat_number: '',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not book a trip without trip id', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token,
      })
      .send({
        trip_id: '', seat_number: '2',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not book a trip without a correct trip id', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token,
      })
      .send({
        trip_id: '30', seat_number: '3',
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not book a trip if trip id is not a number', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'token': token,
      })
      .send({
        trip_id: 're', seat_number: '4',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should get all bookings', (done) => {
    chai.request(app)
      .get('/api/v1/bookings')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });
  it('should get all bookings', (done) => {
    chai.request(app)
      .get('/api/v1/bookings')
      .set({
        'token': token1,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });
  it('should delete bookings', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/1')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
  });
  it('should not delete bookings with wrong params', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/50')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not delete bookings if params is not a number', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/1b')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should cancel trip', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/1')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
  });
  it('should not cancel trip with wrong params', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/50')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not cancel trips if params is not a number', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/1b')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not cancel trips if trip is already cancelled', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/1')
      .set({
        'token': token,
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should filter trip with origin', (done) => {
    chai.request(app)
      .get('/api/v1/trips/filter')
      .set({
        'token': token,
      })
      .send({ origin: 'lagos' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });
  it('should filter trip with destination', (done) => {
    chai.request(app)
      .get('/api/v1/trips/filter')
      .set({
        'token': token,
      })
      .send({ destination: 'kaduna' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });
  it('should not filter trip with without destination or origin', (done) => {
    chai.request(app)
      .get('/api/v1/trips/filter')
      .set({
        'token': token,
      })
      .send({ destination: '' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not filter trip with with destination and origin', (done) => {
    chai.request(app)
      .get('/api/v1/trips/filter')
      .set({
        'token': token,
      })
      .send({ destination: 'lagos', origin: 'alabama' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not filter trip with wrong destination', (done) => {
    chai.request(app)
      .get('/api/v1/trips/filter')
      .set({
        'token': token,
      })
      .send({ destination: 'boston' })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not filter trip with wrong origin', (done) => {
    chai.request(app)
      .get('/api/v1/trips/filter')
      .set({
        'token': token,
      })
      .send({ origin: 'bostone' })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
