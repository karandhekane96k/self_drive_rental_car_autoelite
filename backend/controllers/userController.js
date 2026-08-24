import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  try {
    // NEW: We added 'mobile' here to grab it from the frontend
    const { name, email, mobile, password } = req.body; 

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // NEW: We pass 'mobile' into the database creation
    const user = await User.create({
      name,
      email,
      mobile,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile, // NEW: We send the mobile number back to the frontend on success
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    // We will accept 'email' from the frontend, but it might contain their mobile number too!
    const { email, password } = req.body;

    // Look for the user by matching EITHER their email OR their mobile number
    const user = await User.findOne({
      $or: [{ email: email }, { mobile: email }]
    });

    // If the user exists, we use the matchPassword method we built earlier
    // This safely compares the typed password to the encrypted database hash
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/mobile or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};