router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const User = require("../models/User");

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
