/**
 * Express application for serving static files and handling API requests.
 * @module API
 */

const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
const db = require("./db").db;

/**
 * Handles a user liking a listing.
 *
 * @function
 * @name handleLike
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/like'
 * const likeData = {
 *     username: "testuser",
 *     listingId: 1,
 *   };
 * const likedResponse = await fetch(`${serverIp}/api/like`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify(likeData),
 *   });
 *
 * if (likedResponse.status > 201) {
 *     console.log("Error Liking listing:", 1, likedResponse.status);
 * }
 */
router.post("/like", function (req, res) {
  const { username, listingId } = req.body;

  db.run(
    "INSERT INTO Likes (Username, ListingId) VALUES (?, ?)",
    [username, listingId],
    (err, row) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({
        message: `${username} successfully liked listing ${listingId}`,
      });
    }
  );
});

/**
 * Handles a user unliking a listing.
 *
 * @function
 * @name handleUnlike
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/like'
 * const unlikeData = {
 *     username: "testuser",
 *     listingId: 1,
 *   };
 * const unlikedResponse = await fetch(`${serverIp}/api/like`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify(unlikeData),
 *   });
 *
 * if (unlikedResponse.status > 201) {
 *     console.log("Error Unliking listing:", 1, unlikedResponse.status);
 * }
 */
router.delete("/like", function (req, res) {
  const { username, listingId } = req.body;

  db.run(
    "DELETE FROM Likes WHERE (Username, ListingId) = (?, ?)",
    [username, listingId],
    (err) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({
        message: `${username} successfully unliked listing ${listingId}`,
      });
    }
  );
});

/**
 * GET request endpoint at /api/likes for retrieving a list of likes.
 *
 * @function
 * @name getLikes
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/likes'
 * const likesResponse = await fetch(`${serverIp}/api/likes`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (likesResponse.status === 200) {
 *     const likesData = await likesResponse.json();
 *     console.log("List of Likes:", likesData.Likes);
 * }
 */
router.get("/likes", function (req, res) {
  // Query the database for a list of likes
  db.all("SELECT * FROM Likes", (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Respond with a JSON array of likes
    return res.status(200).json({ Likes: rows });
  });
});

/**
 * DELETE request endpoint at /api/likes for deleting all likes.
 *
 * @function
 * @name deleteAllLikes
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/likes'
 * const deleteLikesResponse = await fetch(`${serverIp}/api/likes`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (deleteLikesResponse.status === 200) {
 *     const result = await deleteLikesResponse.json();
 *     console.log("All likes deleted. Message:", result.message);
 * }
 */
router.delete("/likes", function (req, res) {
  db.run("DELETE FROM Likes", (err) => {
    if (err) {
      console.error("Error deleting all likes:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(200).json({ message: "All likes deleted" });
  });
});

// Export the router
module.exports = router;
