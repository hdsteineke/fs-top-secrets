const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create ({ firstName, lastName, email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    return user;
  }
  
  // Sign in function takes as arguments: an email and a password stored as string to allow the hash format (??)
  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);
      // If no user, alert Invalid email
      if (!user) throw new Error('Invalid email');
      // If the provided hashed password does not match that which is associated with the given email, user receives invalid password error
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid password');
      //if user is logged in successfully, a token is generated for that user including the secret key and an expiration window
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
