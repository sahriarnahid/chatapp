import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllUsers);
router.post("/request/:id", protectRoute, sendFriendRequest);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);

export default router;
