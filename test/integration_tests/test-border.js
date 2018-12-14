'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();  // Allows use of `should` in tests
chai.use(chaiHttp);

const app = require('../../app');
const expressServer = app.getExpress();
app.listenRandomPort().then((port) => {
  console.log(`Tests running on port ${port}`);
});

after('done', done => {require('../../server').close(done); done();});

const validateMtgJson = (res) => {
  res.should.have.status(200);
  res.type.should.equal(`application/json`);
  res.body.should.be.a('array');
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseid');
  res.body[0].should.have.property('imageUrl');
};

describe('border search', () => {
  it('should return at all white-bordered cards', (done) => {
    app.getReady().then(() => {
      chai.request(expressServer)
        .get('/card/json?unique&q=border:white&limit=10')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(10);
          res.body.forEach(c => c.border.toLowerCase().should.equal(`white`));         
          done();
        });
    });
  }).timeout(3000);  
});