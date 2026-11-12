import { StreamChat } from "stream-chat";
import "dotenv/config";

const apikey = process.env.STEAM_API_KEY;
const apisecret = process.env.STEAM_API_SECRET;

if (!apikey || !apisecret) {
  //   throw new Error("Missing Stream API key or secret in environment variables");
  console.error("Missing Stream API key or secret in environment variables");
}

const streamclient = StreamChat.getInstance(apikey, apisecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamclient.upsertUser([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString()

    const token = streamclient.createToken(userIdStr);
    return token;
  } catch (error) {
    console.error("Error creating Stream token:", error);
  }
};
