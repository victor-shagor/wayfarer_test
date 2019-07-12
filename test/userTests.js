import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();


describe('users', () => {
  describe('POST /', () => {
    it('should post a user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'abiola', last_name: 'ojo', email: 'ojo@gmail.com', password: 'oladimeji1',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('user_id');
          res.body.data.should.have.property('is_admin');
          res.body.data.should.have.property('token');

          done();
        });
    });
    it('should not create a user without any of the required field ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          last_name: 'ojo', email: 'ojo@gmail.com', password: 'fggfdgfd123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create a user without a firstName ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: '', last_name: 'ojo', email: 'ojo@gmail.com', password: 'fggfdgfd123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create a user without a lastName ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'abiola', last_name: '', email: 'ojo@gmail.com', password: 'sdsdxxsx123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');

          done();
        });
    });
    it('should not create a user without an email ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'abiola', last_name: 'ojo', email: '', password: 'wdwedew123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not create a user without a password ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'abiola', last_name: 'ojo', email: 'ojo@gmail.com', password: '',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create a user with a used email ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'abiola', last_name: 'ojo', email: 'ojo@gmail.com', password: 'oladimeji1',
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create a user with a wrong email ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'abiola', last_name: 'ojo', email: 'ojo.com', password: 'oladimeji1',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create a user with a correct name ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'ab', last_name: 'ojo', email: 'ojo@gmail.com', password: 'oladimeji1',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create a user if password does not contain a number ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'ab', last_name: 'ojo', email: 'ojo@gmail.com', password: 'oladimejiii',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should signin a user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyin@gmail.com', password: 'adedoyin1',
        })
        .end((err, res) => {
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
    it('should not signin a user with incorrect email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'dee@gmail.com', password: 'adedoyin1',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not signin a user without email ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: '', password: 'adedoyin1',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not signin a user without password ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyin@gmail.com', password: '',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not signin without required field ', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          password: 'oljfcjjdjncjn1',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
