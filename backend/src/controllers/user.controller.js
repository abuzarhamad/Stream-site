import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const getRecomendedUsers = async (req, res) => {
  try {
    const currentuserId = req.User.id;
    const currentuser = req.user;

    const recomendedUsers = await User.find({
      //   _id: { $ne: currentuserId },
      //   isOnboarded: true,
      //   nativeLanguage: currentuser.learningLanguage,
      //   learningLanguage: currentuser.nativeLanguage,
      $and: [
        { _id: { $ne: currentuserId } },
        { _id: { $nin: currentuser.friends } },
        { isOnboarded: true },
      ],
    });
    // res.status(200).json({ success: true, users: recomendedUsers });
    res.status(200).json(recomendedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching recommended users" });
  }
};

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilepic nativelanguage learningLanguage",
      );

    res.status(200).json(user.friends);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching recommended users" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "Recipient not found" });
    }
    // check if the recipient is already in the sender's friends list
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent" });
    }

    const friendRequest = new FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res
      .status(201)
      .json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending friend request" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { ud: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this friend request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // each user adds the other to their friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error accepting friend request" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilepic nativelanguage learningLanguage",
    );

    const acceptedRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate("sender", "fullName profilepic");

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching friend requests" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilepic nativelanguage learningLanguage",
    );

    res.status(200).json({ outgoingRequests });
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching outgoing friend requests",
      });
  }
}
