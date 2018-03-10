const { app, chai, expect } = require('./');
const User = require(`${process.cwd()}/app/models/user`);

describe('Auth Api', () => {
  beforeEach(done => {
    User.create({ email: 'some@mail.com', password: 'qwerty' }, () => done());
  });
  afterEach(done => {
    User.remove({}).exec(() => done());
  });

  it('[POST] /auth/sign_in should return token', done => {
    chai
      .request(app)
      .post('/auth/sign_in')
      .send({ email: 'some@mail.com', password: 'qwerty' })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body.token).to.be.a('string');
        done();
      });
  });

  it('[POST] /auth/sign_in should return unauthorized message', done => {
    chai
      .request(app)
      .post('/auth/sign_in')
      .send({ email: 'sometest@mail.com', password: 'qwerty' })
      .end((error, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.be.equal('wrong email or password');
        done();
      });
  });

  it('[POST] /auth/sign_in should return error message', done => {
    chai
      .request(app)
      .post('/auth/sign_in')
      .send({ email: 'sometest@mail.com' })
      .end((error, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.be.equal('email and password required!');
        done();
      });
  });

  it('[POST] /auth/sign_up should return token', done => {
    chai
      .request(app)
      .post('/auth/sign_up')
      .send({ email: 'some2@mail.com', password: 'qwerty' })
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body.token).to.be.a('string');
        done();
      });
  });

  it('[POST] /auth/sign_up if user already exists should return error message', done => {
    chai
      .request(app)
      .post('/auth/sign_up')
      .send({ email: 'some@mail.com', password: 'qwerty' })
      .end((error, res) => {
        expect(res).to.have.status(403);
        expect(res.body.errors).to.have.own.property('email');
        expect(res.body.errors.email.message).to.be.equal(
          'User already exists'
        );
        done();
      });
  });

  it('[POST] /auth/sign_up should return error message', done => {
    chai
      .request(app)
      .post('/auth/sign_up')
      .send({ email: 'some@mail.com' })
      .end((error, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.be.equal('email and password required!');
        done();
      });
  });
});
