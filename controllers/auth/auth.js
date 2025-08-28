// src/controllers/auth/auth.js
import jwt from "jsonwebtoken"

const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    username: user.userName || user.username, // handle both cases
    email: user.email,
    role: user.role // ← THIS IS THE CRITICAL ADDITION
  };
  
  return jwt.sign(payload, "abcd", { expiresIn: "2d" });
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    username: user.userName || user.username,
    role: user.role // ← Also add role to refresh token
  };
  
  return jwt.sign(payload, "cdef", { expiresIn: "7d" });
};

export { generateAccessToken, generateRefreshToken };