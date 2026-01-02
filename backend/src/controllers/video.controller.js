import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const token = serverClient.createToken(userId);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Stream token error:", error);
    res.status(500).json({ message: "Failed to generate token" });
  }
};

