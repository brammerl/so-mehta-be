const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('so-mehta-be routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('signs up an user with username, password and profile image', () => {
    return request(app) 
    .post('/api/v1/auth/signup/')
    .send({
      username: 'tester username',
      password: 'tester password',
      profileImage: 'https://testerprofile.com'
    })
    .then(res => {
      expect(res.body).toEqual({
        _id: expect.anything(String),
        username: 'tester username',
        profileImage: 'https://testerprofile.com'
      })
    })
  });

  it('logs in an user with an username and password', async() => {
    await User.create({
      username: 'tester username',
      password: 'password',
      profileImage: 'https://testerprofile.com'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'tester username',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'tester username',
          profileImage: 'https://testerprofile.com'
        });
      });
  });

  it('verifies a signed up user', () => {
    const agent = request.agent(app);
    return agent
      .post('/api/v1/auth/signup')
      .send({ username: 'username', password: 'password', profileImage: 'https://prof.com' })
      .then(() => agent.get('/api/v1/auth/verify'))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'username',
          profileImage: 'https://prof.com'
      });
    });
  });
});