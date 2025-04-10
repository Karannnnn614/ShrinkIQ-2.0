import jwt from "jsonwebtoken";

const hardcodedCredentials = {
  email: "intern@dacoid.com",
  password: "Test123",
  id: "663d83044a011e2cddc38c3a", // 👈 use a real or fake MongoDB ObjectId
};

export const login = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (
    email === hardcodedCredentials.email &&
    password === hardcodedCredentials.password
  ) {
    const token = jwt.sign(
      { id: hardcodedCredentials.id, email }, // ✅ add `id` to token payload
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};
