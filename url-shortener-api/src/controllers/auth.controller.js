// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";

const hardcodedCredentials = {
  email: "intern@dacoid.com",
  password: "Test123",
};

export const login = (req, res) => {
  const { email, password } = req.body || {};

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Validate credentials
  if (
    email === hardcodedCredentials.email &&
    password === hardcodedCredentials.password
  ) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};
