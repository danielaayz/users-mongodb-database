import express, { json } from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
   .connect("mongodb://localhost:27017/mynewdatabase")
   .then(() => console.log("Connected to MongoDB"))
   .catch((err) => console.error("Could not connect to MongoDB", err));
// Defines the User Schema
const userSchema = new mongoose.Schema({
   first_name: String,
   last_name: String,
   email: String,
});

// Create a Modle
const User = mongoose.model("User", userSchema);

//module.exports = User;

app.get("/users", async (req, res) => {
   try {
      const users = await User.find();
      res.json(users);
   } catch (error) {
      res.status(500).json({ error: "Failed to get users" });
   }
});

app.post("/users", async (req, res) => {
   try {
      const newUser = new User(req.body);
      await newUser.save();
      res.json(newUser);
   } catch (error) {
      res.status(500).json({ error: "Failed to post user" });
   }
});

app.put("/users/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
         new: true,
      });
      if (!updatedUser) {
         return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
   } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
   }
});

app.delete("/users/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
         return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "User deleted", User: deletedUser });
   } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
   }
});

app.listen(3000, () =>
   console.log("Server is running at http://localhost:3000")
);
