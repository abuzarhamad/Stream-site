import { generateStreamToken } from "../config/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id); 
    
    
    // Assuming you have a function to generate the token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating stream token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
