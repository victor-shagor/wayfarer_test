import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();
const { expect } = chai;


describe('Root route', () => {
  it('should display welcome', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.body.message).to.equal('Welcome to Wayfarer');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should display route not found', (done) => {
    chai.request(app)
      .get('/invalid/route')
      .end((err, res) => {
        expect(res.body.message).to.equal('route not found');
        expect(res.status).to.equal(200);
        done();
      });
  });
});
