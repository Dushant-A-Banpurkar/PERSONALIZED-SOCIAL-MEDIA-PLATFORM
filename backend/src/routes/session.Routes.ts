import express from "express";
import {
  createSession,
  getSessions,
  joinSession,
  updateSession,
  leaveSession,
  raiseHand,
} from "../controller/sessions.controller";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

// Routes
router.post("/create", protectRoute, createSession);  // Changed to POST /sessions
router.get("/", protectRoute, getSessions);    // GET /sessions for all sessions
router.post("/:sessionId/join", protectRoute, joinSession);   // POST /sessions/:sessionId/join
router.put("/:sessionId", protectRoute, updateSession);      // PUT /sessions/:sessionId
router.post("/:sessionId/leave", protectRoute, leaveSession); // POST /sessions/:sessionId/leave
router.post("/:sessionId/raise-hand", protectRoute, raiseHand); // POST /sessions/:sessionId/raise-hand

export default router;
