import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Incoming token:", token);

  jwt.verify(token, "abcd", (err, decoded) => {
    if (err) {
      console.log("❌ JWT Verify Error:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("✅ Decoded payload:", decoded);
    req.user = decoded;
    next();
  });
};
