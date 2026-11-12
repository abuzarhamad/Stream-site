import { upsertStreamUser } from "../config/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All Fiels are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "Email already exist please user different one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;

    const randomAvatar = `https://api.dicebear.com/10.x/avataaars/png?seed=${idx}`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilepic: randomAvatar,
    });

    //for stream chat integration

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilepic || "",
      });
      console.log(`stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("error creating stream user ", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      // user: {
      //   _id: newUser._id,
      //   fullName: newUser.fullName,
      //   email: newUser.email,
      //   profilepic: newUser.profilepic,
      // },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    // console.log("User found:", user); // Log the user object for debugging

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
}

export async function onboard(req, res) {
  try {
    console.log("onboard function called with user:", req.user);

    const userId = req.user._id;
    const {
      fullName,
      bio,
      profilepic,
      nativelanguage,
      learninglanguage,
      location,
    } = req.body;

    if (
      !fullName ||
      !bio ||
      !profilepic ||
      !nativelanguage ||
      !learninglanguage ||
      !location
    ) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          // missingFields: {
          //   fullName: !fullName,
          //   bio: !bio,
          //   profilepic: !profilepic,
          //   nativelanguage: !nativelanguage,
          //   learninglanguage: !learninglanguage,
          //   location: !location
          // }

          missingFields: [
            !fullName && "fullName",
            !bio && "bio",
            !profilepic && "profilepic",
            !nativelanguage && "nativelanguage",
            !learninglanguage && "learninglanguage",
            !location && "location",
          ],
        })
        .filter(Boolean);
    }

    const updateduser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true },
    );

    if (!updateduser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    try {
      await upsertStreamUser({
        id: updateduser._id.toString(),
        name: updateduser.fullName,
        image: updateduser.profilepic || "",
      });
      console.log(`stream user updated for ${updateduser.fullName}`);
    } catch (streamError) {
      console.error("Error upserting stream user:", streamError);
    }

    res.status(200).json({
      success: true,
      message: "User onboarded successfully",
      user: updateduser,
    });
  } catch (error) {
    console.error("Error onboarding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


