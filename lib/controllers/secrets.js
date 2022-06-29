const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()

  .get('/', authenticate, async (req, res, next) => {
    try {
      const listOfSecrets = await Secret.getAll();
      res.json(listOfSecrets);
    } catch (error) {
      next (error);
    }
  });
