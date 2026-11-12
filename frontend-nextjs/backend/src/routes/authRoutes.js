import express from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserById, updateUser } from '../data/store.js';
import { requireAuth, signToken } from '../utils/auth.js';

const router = express.Router();

const makeUser = ({ fullName, email, password }) => ({
  _id: Math.random().toString(36).slice(2, 11),
  fullName,
  email,
  password: bcrypt.hashSync(password, 10),
  nativeLanguage: '',
  learningLanguages: [],
  proficiency: '',
  createdAt: new Date().toISOString(),
});

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (getUserByEmail(email)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = makeUser({ fullName, email, password });
  createUser(user);

  const token = signToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    message: 'User created successfully',
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      learningLanguages: user.learningLanguages,
      proficiency: user.proficiency,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = getUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: 'Login successful',
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      learningLanguages: user.learningLanguages,
      proficiency: user.proficiency,
    },
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
});

router.get('/me', requireAuth, (req, res) => {
  const user = getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      learningLanguages: user.learningLanguages,
      proficiency: user.proficiency,
    },
  });
});

router.post('/onboarding', requireAuth, (req, res) => {
  const { nativeLanguage, learningLanguages, proficiency } = req.body;

  if (!nativeLanguage || !learningLanguages || learningLanguages.length === 0 || !proficiency) {
    return res.status(400).json({ message: 'Please complete all onboarding fields' });
  }

  const user = getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = updateUser(user._id, {
    nativeLanguage,
    learningLanguages,
    proficiency,
  });

  return res.json({
    message: 'Onboarding completed',
    user: {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      nativeLanguage: updatedUser.nativeLanguage,
      learningLanguages: updatedUser.learningLanguages,
      proficiency: updatedUser.proficiency,
    },
  });
});

export default router;
