import express from "express";
import dotenv from "dotenv";
// import 'dotenv/config';
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //allow frontend to send the cookie
  }),
);

// app.get('/api/auth/signup', (req, res) => {
//   res.send('Hello, World!');
// });
// app.get('/api/auth/login', (req, res) => {
//   res.send('login');
// });
// app.get('/api/auth/logout', (req, res) => {
//   res.send('logout');
// });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
