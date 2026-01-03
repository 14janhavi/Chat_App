export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
