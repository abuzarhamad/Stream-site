const store = {
  users: [],
  friendRequests: [],
};

export const resetDataStore = () => {
  store.users = [];
  store.friendRequests = [];
};

export const getUsers = () => store.users;

export const getUserById = (id) => store.users.find((user) => user._id === id);

export const getUserByEmail = (email) =>
  store.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const createUser = (user) => {
  store.users.push(user);
  return user;
};

export const updateUser = (userId, updates) => {
  const userIndex = store.users.findIndex((user) => user._id === userId);
  if (userIndex === -1) return null;
  store.users[userIndex] = { ...store.users[userIndex], ...updates };
  return store.users[userIndex];
};

export const getFriendRequests = () => store.friendRequests;

export const createFriendRequest = (request) => {
  store.friendRequests.push(request);
  return request;
};

export const getFriendRequest = (senderId, receiverId) =>
  store.friendRequests.find(
    (request) =>
      request.senderId === senderId && request.receiverId === receiverId && !request.isAccepted
  );

export const getIncomingFriendRequests = (userId) =>
  store.friendRequests.filter(
    (request) => request.receiverId === userId && !request.isAccepted
  );

export const getOutgoingFriendRequests = (userId) =>
  store.friendRequests.filter(
    (request) => request.senderId === userId && !request.isAccepted
  );

export const acceptFriendRequest = (senderId, receiverId) => {
  const request = store.friendRequests.find(
    (item) =>
      item.senderId === senderId &&
      item.receiverId === receiverId &&
      !item.isAccepted
  );

  if (!request) return null;

  request.isAccepted = true;
  request.acceptedAt = new Date().toISOString();
  return request;
};
