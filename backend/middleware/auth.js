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
    console.log("User ID from auth:", req.auth.userId);
    const user = await clerkClient.users.getUser(req.auth.userId);
    console.log("Fetched user:", user);
    if (user.publicMetadata?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden – admin only" });
    }
    // If the user is an admin, continue to the next middleware or route handler
    console.log("User is an admin, proceeding to next middleware");
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
