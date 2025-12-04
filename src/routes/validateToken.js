// Express route for validating JWT token
// Place this in your backend (simple-server.js or routes/auth.js)
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "xeno_secret";

// Accept GET request + token in query
router.get("/validate-token", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing token",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

module.exports = router;
