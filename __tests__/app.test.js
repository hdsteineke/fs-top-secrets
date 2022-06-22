const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// creating user for testing
const demoUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};

//function that handles login/sign-up by creating a user and/or posting user to sessions
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? demoUser.password;

  //this agent constant allows cookies to be stored between requests during testing
  const agent = request.agent(app);

  // Creates a user
  const user = await UserService.create({ ...demoUser, ...userProps });

  // Signs user in by posting their email and username to the session
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(demoUser);
    const { firstName, lastName, email } = demoUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('returns the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');

    console.log('me', me);

    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

});
