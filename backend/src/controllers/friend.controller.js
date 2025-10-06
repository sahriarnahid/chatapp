import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get all users except yourself
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .populate("friends", "fullName profilePic")
      .populate("friendRequests", "fullName profilePic");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;
    const friend = await User.findById(friendId);
    if (!friend) return res.status(404).json({ message: "User not found" });

    if (!friend.friendRequests.includes(req.user._id)) {
      friend.friendRequests.push(req.user._id);
      await friend.save();

      const socketId = getReceiverSocketId(friendId);
      if (socketId) {
        io.to(socketId).emit("receive_friend_request", {
          _id: req.user._id,
          fullName: req.user.fullName,
          profilePic: req.user.profilePic,
        });
      }
    }

    res.json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send friend request" });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;
    const friend = await User.findById(friendId)
      .select("-password")
      .populate("friends", "fullName profilePic")
      .populate("friendRequests", "fullName profilePic");

    if (!friend) return res.status(404).json({ message: "User not found" });

    if (!req.user.friends.includes(friend._id)) req.user.friends.push(friend._id);
    if (!friend.friends.includes(req.user._id)) friend.friends.push(req.user._id);

    req.user.friendRequests = req.user.friendRequests.filter(
      (id) => id.toString() !== friend._id.toString()
    );

    await req.user.save();
    await friend.save();

    const socketId = getReceiverSocketId(friendId);
    if (socketId) {
      io.to(socketId).emit("friend_request_accepted", {
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePic: req.user.profilePic,
      });
    }

    res.json({ _id: friend._id, fullName: friend.fullName, profilePic: friend.profilePic });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept friend request" });
  }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;
    req.user.friendRequests = req.user.friendRequests.filter(
      (id) => id.toString() !== friendId
    );
    await req.user.save();
    res.json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject friend request" });
  }
};
