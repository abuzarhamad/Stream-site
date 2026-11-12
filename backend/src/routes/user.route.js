import express from "express";
import { protectRoute } from "../middleware/auth.middlerware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequests, getRecomendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecomendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequest);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);



export default router;
