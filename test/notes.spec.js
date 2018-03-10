const { app, chai, expect } = require('./');
const User = require(`${process.cwd()}/app/models/user`);
const Note = require(`${process.cwd()}/app/models/note`);

describe('Notes Api', () => {
  let token = '',
    noteId = '';
  beforeEach(done => {
    User.create(
      { email: 'some@mail.com', password: 'qwerty' },
      (error, user) => {
        chai
          .request(app)
          .post('/auth/sign_in')
          .send({ email: 'some@mail.com', password: 'qwerty' })
          .then(res => {
            token = res.body.token;
            Note.create(
              { owner: user._id, title: 'title', text: 'text' },
              (error, note) => {
                noteId = note._id;
                done();
              }
            );
          });
      }
    );
  });

  afterEach(done => {
    noteId = token = '';
    User.remove({}).exec(() => {
      Note.remove({}).exec(() => done());
    });
  });

  it('[GET] /todos should return unauthorized status with invalid token', done => {
    chai
      .request(app)
      .get('/notes')
      .set('Authorization', 'jwt sometoken')
      .end((error, res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.be.equal('Unauthorized');
        done();
      });
  });

  it('[GET] /todos should return notes', done => {
    chai
      .request(app)
      .get('/notes')
      .set('Authorization', `jwt ${token}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.a('array')
          .that.have.length(1);
        done();
      });
  });

  it('[GET] /todos/:id should return correct note', done => {
    chai
      .request(app)
      .get(`/notes/${noteId}`)
      .set('Authorization', `jwt ${token}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.include({ title: 'title', text: 'text' });
        done();
      });
  });

  it('[PATCH] /todos/:id should correctly update note', done => {
    chai
      .request(app)
      .patch(`/notes/${noteId}`)
      .set('Authorization', `jwt ${token}`)
      .send({ title: 'test title' })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.include({ title: 'test title' });
        done();
      });
  });

  it('[DELETE] /todos/:id should correctly delete note', done => {
    chai
      .request(app)
      .delete(`/notes/${noteId}`)
      .set('Authorization', `jwt ${token}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal('ok');
        done();
      });
  });
});
