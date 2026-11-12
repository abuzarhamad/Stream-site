import express from 'express';
import { requireAuth } from '../utils/auth.js';
import {
  acceptFriendRequest,
  createFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
  getUserById,
  getUsers,
} from '../data/store.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const currentUserId = req.user.id;
  const users = getUsers()
    .filter((user) => user._id !== currentUserId)
    .map((user) => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      learningLanguages: user.learningLanguages,
      proficiency: user.proficiency,
    }));

  return res.json({ users });
});

router.get('/friends', requireAuth, (req, res) => {
  const currentUserId = req.user.id;
  const users = getUsers();

  const acceptedRequests = getFriendRequests().filter(
    (request) =>
      (request.senderId === currentUserId || request.receiverId === currentUserId) &&
      request.isAccepted
  );

  const friendIds = new Set(
    acceptedRequests.map((request) =>
      request.senderId === currentUserId ? request.receiverId : request.senderId
    )
  );

  const friends = users
    .filter((user) => friendIds.has(user._id))
    .map((user) => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      learningLanguages: user.learningLanguages,
      proficiency: user.proficiency,
    }));

  return res.json({ friends });
});

router.post('/friend-request/:userId', requireAuth, (req, res) => {
  const senderId = req.user.id;
  const { userId } = req.params;

  if (senderId === userId) {
    return res.status(400).json({ message: 'You cannot send a request to yourself' });
  }

  const receiver = getUserById(userId);
  if (!receiver) {
    return res.status(404).json({ message: 'User not found' });
  }

  const existingRequest = getFriendRequests().find(
    (request) =>
      ((request.senderId === senderId && request.receiverId === userId) ||
        (request.senderId === userId && request.receiverId === senderId)) &&
      !request.isAccepted
  );

  if (existingRequest) {
    return res.status(409).json({ message: 'Friend request already exists' });
  }

  const request = createFriendRequest({
    _id: Math.random().toString(36).slice(2, 11),
    senderId,
    receiverId: userId,
    isAccepted: false,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({
    message: 'Friend request sent',
    request,
  });
});

router.put('/friend-request/:userId/accept', requireAuth, (req, res) => {
  const receiverId = req.user.id;
  const { userId } = req.params;

  const request = acceptFriendRequest(userId, receiverId);
  if (!request) {
    return res.status(404).json({ message: 'Friend request not found' });
  }

  return res.json({
    message: 'Friend request accepted',
    request,
  });
});

router.get('/friend-requests', requireAuth, (req, res) => {
  const userId = req.user.id;
  const requests = getFriendRequests()
    .filter((request) => request.receiverId === userId && !request.isAccepted)
    .map((request) => ({
      _id: request._id,
      senderId: {
        _id: getUserById(request.senderId)?._id,
        fullName: getUserById(request.senderId)?.fullName,
        email: getUserById(request.senderId)?.email,
        nativeLanguage: getUserById(request.senderId)?.nativeLanguage,
      },
    }));

  return res.json({ friendRequests: requests });
});

router.get('/outgoing-friend-requests', requireAuth, (req, res) => {
  const userId = req.user.id;
  const requests = getFriendRequests()
    .filter((request) => request.senderId === userId && !request.isAccepted)
    .map((request) => ({
      _id: request._id,
      receiverId: request.receiverId,
      createdAt: request.createdAt,
    }));

  return res.json({ outgoingFriendRequests: requests });
});

export default router;
