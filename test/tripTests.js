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
        done();
      });
  });
  it('should create a trip', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'x-access-token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'kaduna', trip_date: '06/06/2019', fare: '2000',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        done();
      });
  });
  it('should not create a trip without bus id', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'x-access-token': token,
      })
      .send({
        bus_id: '', origin: 'ojo', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
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
        'x-access-token': token,
      })
      .send({
        bus_id: '1', origin: '', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
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
        'x-access-token': token,
      })
      .send({
        bus_id: '1', origin: 'ojo', destination: '', trip_date: '06/06/2019', fare: '3000',
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
        'x-access-token': token,
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
  it('should not create a trip without fare', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'x-access-token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2019', fare: '',
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
        'x-access-token': token,
      })
      .send({
        bus_id: '20', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip when bus id is not in the database', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'x-access-token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a trip with a bus already on a trip', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set({
        'x-access-token': token,
      })
      .send({
        bus_id: '1', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
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
        'x-access-token': '',
      })
      .send({
        bus_id: '3', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
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
        'x-access-token': '123ed',
      })
      .send({
        bus_id: '3', origin: 'lagos', destination: 'alabama', trip_date: '06/06/2019', fare: '3000',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should get all trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set({
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should book a trip', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'x-access-token': token,
      })
      .send({
        trip_id: '1',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should not book a trip without trip id', (done) => {
    chai.request(app)
      .post('/api/v1/bookings')
      .set({
        'x-access-token': token,
      })
      .send({
        trip_id: '',
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
        'x-access-token': token,
      })
      .send({
        trip_id: '30',
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
        'x-access-token': token,
      })
      .send({
        trip_id: 're',
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
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should delete bookings', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/1')
      .set({
        'x-access-token': token,
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
        'x-access-token': token,
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
        'x-access-token': token,
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
        'x-access-token': token,
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
        'x-access-token': token,
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
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
