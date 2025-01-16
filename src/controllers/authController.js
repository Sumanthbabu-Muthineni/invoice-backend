// src/controllers/AuthController.js
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registration attempt:', { name, email }); // Debug log

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email); // Debug log
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user with explicit schema validation
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('User created successfully:', user._id); // Debug log

    // Generate token and send response
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error); // Error log
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email); // Debug log

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token and send response
    const token = generateToken(user._id);
    console.log('Login successful:', user._id); // Debug log

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error); // Error log
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};
exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };