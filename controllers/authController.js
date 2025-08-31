import defineUserModel from "../model/userModel.js"
import { User } from "../db/dbConnection.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "./auth/auth.js";
import jwt from "jsonwebtoken"

export const authController = async (req, res) => {
  try {
    console.log(req.body);

    const { username, email, password , role} = req.body;

    // console.log("Incoming body:", req.body);


    // Validation
    if (!username || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { userName: username } });

    if (existingUser !== null) {
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

    switch(role) {
      case 'admin':
      case 'society':
      case 'principle':
        permissions.feeManagement = {
          viewStatus: true,
          viewReports: true,
          generateVouchers: false,
          processPayments: false,
          applyDiscounts: false,
          manageSettings: (role === 'admin') // Only admin can manage settings
        };
        break;
      case 'accountant':
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
        // Society members get view-only access by default
        permissions.feeManagement.viewStatus = true;
        permissions.feeManagement.viewReports = true;
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 5)
    const newUser = await User.create({
      userName: username, // match your model field
      email,
      password: hashedPassword,
      role
      // accessToken: accessToken,
      // refreshToken: refreshToken,

    });

    const accessToken = generateAccessToken(newUser.dataValues);
    const refreshToken = generateRefreshToken(newUser.dataValues);

    await newUser.update({ refreshToken });

    return res.status(201).json({
      message: "User registered and logged in",
      user: {
        id: newUser.id,
        username: newUser.userName,
        email: newUser.email,
        role:role,
        accessToken,
        refreshToken,
        permissions:newUser.permissions,
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exist = await User.findOne({ where: { email: email } });

    if (!exist) {
      return res.status(404).json({ error: "User not found" });
    }

    if (exist != null) {
      const isvalid = await bcrypt.compare(password, exist.password);
      if (!isvalid) {
        return res.status(401).json("invalid credentials", exist);
      }

      const accessToken = await generateAccessToken(exist.dataValues);
      const refreshToken = await generateRefreshToken(exist.dataValues);

      exist.update({ refreshToken: refreshToken })

      // res.cookie("refreshToken", refreshToken,{httpOnly:true, secure:true})


      await exist.save();

      console.log("Updated refreshToken:", exist.refreshToken);

      return res.status(200).json({
        message: "Logged in successfully",
        user: {
          id: exist.id,
          username: exist.userName,
          email: exist.email,
          accessToken: accessToken,
          refreshToken: refreshToken,
          permissions: exist.permissions
        },
      });
    }

  } catch (e) {
    return res.status(500).json("internal error!");
  }
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.body; // or extract from headers

  console.log("Received refreshToken:", refreshToken);

  if (!refreshToken) {
    return res.status(403).json("Token is missing");
  }

  try {
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) {
      return res.status(403).json("No user found with this token");
    }

    jwt.verify(refreshToken, "cdef", (err, decoded) => {
      if (err) {
        return res.status(403).json("Invalid refresh token");
      }

      const newAccessToken = generateAccessToken(user.dataValues);
      return res.status(200).json({
        message: "Token refreshed successfully",
        user: {
          id: user.id,
          username: user.userName,
          email: user.email,
          accessToken: newAccessToken,
          refreshToken: user.refreshToken,
        },
      });
    });
  } catch (e) {
    return res.status(500).json("Internal error");
  }
};

export const updateProfile = async (req, res) => {
  const { id, username, email ,password, role} = req.body;

  console.log("id:", id);
  if (!id) {
    return res.status(400).josn("Id is missing")
  }
  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return res.status(404).json("no user found with this id!")
    }

    if (username) { user.userName = username }
    if (email) { user.email = email }
    if(password) {user.password=password}
    if (role) {user.role=role}

    await user.save();

    return res.status(200).json({
      
      Message:"Profile Updated Successfully",
      user:{
        id:user.id,
        username:user.username,
        email:user.email,
        role:user.role,
        permissions:user.permissions,
      }
      
    })
  }
  catch (e) {
    return res.status(500).json("internal error!")
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;
  console.log("ID", id)
  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return res.status(404).json("no User Found with this id")
    }
    await user.destroy();

    return res.status(200).json("user deleted successfully")
  }
  catch (e) {
    return res.status(500).json("internal error")
  }
};




