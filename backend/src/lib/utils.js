import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,        // ✅ required on Netlify
    sameSite: "none",    // ✅ required for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
