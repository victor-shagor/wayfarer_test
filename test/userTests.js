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
    let token;
    it('should signin a user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyin@gmail.com', password: 'adedoyin1',
        })
        .end((err, res) => {
          token = res.body.data.token;
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should not signin a user with incorrect email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'd@gmail.com', password: 'adedoyin1',
        })
        .end((err, res) => {
          res.should.have.status(404);
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
  });
});
