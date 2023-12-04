const { expect } = require('chai');
const chai = require('chai');
const { router, authenticateUser } = require('../account');
chai.use(require('chai-http'));
const app = require('../server');
const should = chai.should();

describe('API/Accounts', () => {
  describe('POST /register', () => {
    it('should return an error for an empty username during registration', (done) => {
      chai
        .request(app)
        .post('/api/register')
        .send({ username: '', password: 'password123A!', confirmPassword: 'password123A!', email: 'user@example.com' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error', 'Username cannot be empty');
          done();
        });
    });    
    it('should return an error for mismatched password and confirmPassword', (done) => {
      chai
        .request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          password: 'password123A!',
          confirmPassword: 'password123A!2',
          email: 'newuser@example.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property(
            'error',
            'Password and confirm password are not equal'
          );
          done();
        });
    });
    it('should return an error for an invalid email address', (done) => {
      chai
        .request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          password: 'password123A!',
          confirmPassword: 'password123A!',
          email: 'invalidemail',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error', 'Email is not valid');
          done();
        });
    });
    it('should create an account for valid registration data', (done) => {
      chai
        .request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          password: 'password123A!',
          confirmPassword: 'password123A!',
          email: 'newuser@example.com',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message', 'Account created');
          res.body.should.have.property('username', 'newuser');
          console.log(res);
          done();
        });
    });
    it('should return an error for an existing username', (done) => {
      chai
        .request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          password: 'password123A!',
          confirmPassword: 'password123A!',
          email: 'newuser2@example.com',
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error', 'Username already exists');
          done();
        });
    });
  });
  describe('authenticateUser', () => {
    it('should return true for a registered user with correct password', async () => {
      const isAuthenticated = await authenticateUser('newuser', 'password123A!');
      expect(isAuthenticated).to.be.true;
    });
    it('should return false for a non-registered user', async () => {
      const isAuthenticated = await authenticateUser(
        'nonexistentuser',
        'password123'
      );
      expect(isAuthenticated).to.be.false;
    });
    it('should return false for a registered user with incorrect password', async () => {
      const isAuthenticated = await authenticateUser(
        'newuser',
        'wrongpassword'
      );
      expect(isAuthenticated).to.be.false;
    });
  });
  describe('GET /api/accounts', () => {
    it('should return a list of accounts', (done) => {
      chai
        .request(app)
        .get('/api/accounts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('Accounts');
          done();
        });
    });
  });
  describe('POST /api/login', () => {
    it('should return a success message for a valid login', (done) => {
      chai
        .request(app)
        .post('/api/login')
        .send({ username: 'newuser', password: 'password123A!' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message', 'Login successful');
          done();
        });
    });
    it('should return an error message for an invalid login', (done) => {
      chai
        .request(app)
        .post('/api/login')
        .send({ username: 'newuser', password: 'password123A!2' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error', 'Incorrect password');
          done();
        });
    });
  });
  describe('DELETE /deleteaccount', () => {
    it('should return an error for missing username or password', (done) => {
      chai
        .request(app)
        .delete('/api/deleteaccount')
        .query({ username: 'newuser' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property(
            'error',
            'Both username and password are required'
          );
          done();
        });
    });
    it('should return an error for incorrect password', (done) => {
      chai
        .request(app)
        .delete('/api/deleteaccount')
        .query({ username: 'newuser', password: 'wrongpassword' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error', 'Incorrect password');
          done();
        });
    });
    it('should delete an existing account with correct username and password', (done) => {
      chai
        .request(app)
        .delete('/api/deleteaccount')
        .query({ username: 'newuser', password: 'password123A!' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message', 'newuser account deleted');
          done();
        });
    });
    it('should return an error for non-existing username', (done) => {
      chai
        .request(app)
        .delete('/api/deleteaccount')
        .query({ username: 'newuser', password: 'password123A!' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error', 'Username not found');
          done();
        });
    });
  });
});
