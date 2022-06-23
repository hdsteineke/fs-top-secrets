const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

// for creating a new user
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next (error);
    }
  })


  // Creates a new session for a user upon sign-in
  .post('/sessions', async (req, res, next) => {
    try {
      // ??? pushing email and password into req.body?
      const { email, password } = req.body;
      // Fetches user info via UserService to verify hashed password and assign a token
      const sessionToken = await UserService.signIn({ email, password });

      // Response to successful sign in is to provide a cookie that includes the token, route access, and an expiration period
      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Sign in was successful!' });
    } catch (error) {
      next (error);
    }
  })

  // Returns existing user
  .get('/me', authenticate, (req, res) => {
    res.json(req.user);
  })

  // Fetches a list of users, provided that the current user is authenticated and authorized as admin
  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      next (error);
    }
  });
