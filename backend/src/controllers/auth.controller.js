import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

// Signup
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });

    console.log('🔐 Signup - Creating user:', email);
    console.log('📝 Plain password:', password);

    // Don't hash here - the model's pre-save hook will do it
    const newUser = new User({ fullName, email, password });
    await newUser.save();
    console.log('✅ User created successfully:', email);

    generateToken(newUser._id, res);

    const userToReturn = await User.findById(newUser._id)
      .select('-password')
      .populate('friends', 'fullName profilePic')
      .populate('friendRequests', 'fullName profilePic');

    res.status(201).json(userToReturn);
  } catch (error) {
    console.log('Error in signup controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('🔐 Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found, checking password...');
    console.log('📝 Password from request:', password);
    console.log('📝 Hashed password in DB:', user.password);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isPasswordCorrect);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    generateToken(user._id, res);

    const userToReturn = await User.findById(user._id)
      .select('-password')
      .populate('friends', 'fullName profilePic')
      .populate('friendRequests', 'fullName profilePic');

    console.log('✅ Login successful for:', email);
    res.status(200).json(userToReturn);
  } catch (error) {
    console.log('Error in login controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: 'Profile pic is required' });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    )
      .select('-password')
      .populate('friends', 'fullName profilePic')
      .populate('friendRequests', 'fullName profilePic');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error in update profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check auth
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('friends', 'fullName profilePic')
      .populate('friendRequests', 'fullName profilePic');

    res.status(200).json(user);
  } catch (error) {
    console.log('Error in checkAuth controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
