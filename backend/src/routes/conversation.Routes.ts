import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { getConversation, startConversation } from "../controller/conversation.controller";

const router=express.Router();

router.get('',protectRoute,getConversation);
router.post("/", protectRoute, startConversation);

export default router;