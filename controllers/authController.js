// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserModel } from "../db/dbConnection.js";
import { generateAccessToken, generateRefreshToken } from "./auth/auth.js";

export const authController = async (req, res) => {
  const User = getUserModel();
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { userName: username } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    let permissions = {
      feeManagement: {
        viewStatus: false,
        viewReports: false,
        generateVouchers: false,
        processPayments: false,
        applyDiscounts: false,
        manageSettings: false
      }
    };

    switch (role.toLowerCase()) {
      case "admin":
      case "principle":
      case "society":
        permissions.feeManagement = {
          viewStatus: true,
          viewReports: true,
          generateVouchers: false,
          processPayments: false,
          applyDiscounts: false,
          manageSettings: role.toLowerCase() === "admin"
        };
        break;
      case "accountant":
        permissions.feeManagement = {
          viewStatus: true,
          viewReports: true,
          generateVouchers: true,
          processPayments: true,
          applyDiscounts: true,
          manageSettings: false
        };
        break;
      default:
        permissions.feeManagement.viewStatus = true;
        permissions.feeManagement.viewReports = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName: username,
      email,
      password: hashedPassword,
      role,
      permissions
    });

    const accessToken = generateAccessToken(newUser.dataValues);
    const refreshToken = generateRefreshToken(newUser.dataValues);

    await newUser.update({ refreshToken });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        accessToken,
        refreshToken,
        permissions: newUser.permissions
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  const User = getUserModel();
  const { email, password } = req.body;

  try {
    const exist = await User.findOne({ where: { email } });

    if (!exist) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, exist.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(exist.dataValues);
    const refreshToken = generateRefreshToken(exist.dataValues);

    await exist.update({ refreshToken });

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: exist.id,
        username: exist.userName,
        email: exist.email,
        accessToken,
        refreshToken,
        permissions: exist.permissions
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// REFRESH TOKEN
export const refreshController = async (req, res) => {
  const User = getUserModel();
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(403).json({ error: "Token is missing" });

  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET || "cdef", (err) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = generateAccessToken(user.dataValues);
      return res.status(200).json({
        message: "Token refreshed successfully",
        user: {
          id: user.id,
          username: user.userName,
          email: user.email,
          accessToken: newAccessToken,
          refreshToken: user.refreshToken
        }
      });
    });
  } catch (error) {
    console.error("Refresh Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const User = getUserModel();
  const { id, username, email, password, role } = req.body;

  if (!id) return res.status(400).json({ error: "Id is missing" });

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: "No user found with this id!" });

    if (username) user.userName = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.userName,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const User = getUserModel();
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "Id is missing" });

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: "No user found with this id!" });

    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
