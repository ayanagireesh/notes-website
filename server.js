const Note = require("./models/Note");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://ayana_24:ayana123@cluster0.amzfkfa.mongodb.net/?appName=Cluster0");


// SIGNUP
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashed });
  await user.save();

  res.json({ message: "User created" });
});


// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token });
});


app.listen(5000, () => console.log("Server running on port 5000"));

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    const data = jwt.verify(token, "secret123");
    req.userId = data.id;
    next();
  } catch {
    res.sendStatus(403);
  }
}


// SAVE NOTE
app.post("/notes", auth, async (req, res) => {
  const note = new Note({
    userId: req.userId,
    text: req.body.text
  });

  await note.save();
  res.json({ message: "Note saved" });
});


// GET NOTES
app.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

app.delete("/notes/:id", auth, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});


