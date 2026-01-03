import { StreamChat } from "stream-chat";

export const getStreamToken = async (req, res) => {
  try {
    const client = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    const token = client.createToken(req.user._id.toString());

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate token" });
  }
};
