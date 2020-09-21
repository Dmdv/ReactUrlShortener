const Router = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const router = Router();

router.post(
  '/register',
  [
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Minimum length is 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      console.log('Register Body: ', req.body);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Validation failed'
        });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: 'The user is already registered' });
      }

      const hash = await bcrypt.hash(password, 8);
      const user = new User({ email: email, password: hash });
      await user.save();

      res.status(201).json({ message: 'User has been created' });

    } catch (e) {
      console.log('Register error: ', e);
      res.status(500).json({ message: 'Failed to register with given credentials' });
    }
  });

router.post(
  '/login',
  [
    check('email', 'Email is invalid').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists(),
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Validation failed'
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Failed to login' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Failed to login' });
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        config.get('jwtSecret'),
        {
          expiresIn: '1h'
        }
      );

      res.json({ token, userId: user.id });

    } catch (e) {
      console.log('Login error: ', e);
      res.status(500).json({ message: 'Failed to login with given credentials' });
    }
  });

module.exports = router;