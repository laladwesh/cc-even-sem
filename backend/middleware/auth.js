// middleware/auth.js
const { requireAuth, clerkClient } = require("@clerk/clerk-sdk-node");

/**
 * 1️⃣ requireAuth() will:
 *    • verify the Authorization: Bearer <token> header (or cookie),
 *    • populate req.auth.userId and req.auth.sessionId
 */
const ensureSignedIn = requireAuth();

/**
 * 2️⃣ This middleware fetches the Clerk user and checks their role
 */
async function ensureAdmin(req, res, next) {
  try {
    // req.auth.userId is set by requireAuth()
    const user = await clerkClient.users.getUser(req.auth.userId);

    if (user.publicMetadata?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden – admin only" });
    }

    // you could also attach the full user object to req if you like:
    // req.user = user;
    next();
  } catch (err) {
    console.error("Admin check failed:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = {
  ensureSignedIn,
  ensureAdmin,
};
