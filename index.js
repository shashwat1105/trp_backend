import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./database/ConnectDB.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./model/user.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

ConnectDB();

app.use("/api/user", userRoutes);
app.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: "Email verified successfully! You can now log in." });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });

  }

})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is Running at port number ${PORT}`);
});
