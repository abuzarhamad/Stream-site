import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middlerware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// router.get('/login', (req, res) => {
//     res.send('login Routes')
// });
// router.get('/logout',(req, res)=>{
//     res.send('logout Routes')
// });

export default router;
