import { axiosInstance } from "./axios";

// Auth APIs
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// User APIs
export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/user/");
  return response.data;
};

export const getMyFriends = async () => {
  const response = await axiosInstance.get("/user/friends");
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
};

export const acceptFriendRequest = async (userId) => {
  const response = await axiosInstance.put(`/user/friend-request/${userId}/accept`);
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
};

export const getOutgoingFriendRequests = async () => {
  const response = await axiosInstance.get("/user/outgoing-friend-requests");
  return response.data;
};

// Chat APIs
export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};
