/**
 * Express application for serving static files and handling API requests.
 * @module API
 */

const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const { getImagesFromListings } = require("./listing");
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
    },
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
    },
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

/**
 * Handles rating a user.
 *
 * @function
 * @name rateUser
 *
 * @param {Object} req - Express.js request object with a JSON body containing 'username', 'userRated', and 'rating'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/rate'
 * // Request body should contain a JSON object with 'username', 'userRated', and 'rating' fields.
 * const requestPayload = {
 *   "username": "currentUser",
 *   "userRated": "ratedUser",
 *   "rating": 4.5
 * };
 */
router.post("/rate", async function (req, res) {
  const { username, userRated, rating } = req.body;

  // Check if user is already rated
  const ratingResult = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Ratings WHERE Username = ? AND UserRated = ?",
      [username, userRated],
      (err, row) => {
        if (err) {
          console.error("Error querying the database (check if rated):", err);
          reject(err);
        }
        resolve(row);
      },
    );
  });

  if (ratingResult) {
    // User has already rated, update the rating
    db.run(
      "UPDATE Ratings SET Rating = ? WHERE Username = ? AND UserRated = ?",
      [rating, username, userRated],
      (err) => {
        if (err) {
          console.error("Error updating the rating:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json({
          message: `${username} updated the rating for ${userRated} to ${rating}`,
        });
      },
    );
  } else {
    // User has not rated, insert a new rating
    db.run(
      "INSERT INTO Ratings (Username, UserRated, Rating) VALUES (?, ?, ?)",
      [username, userRated, rating],
      (err, row) => {
        if (err) {
          console.error("Error inserting the rating:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json({
          message: `${username} successfully rated ${userRated} with ${rating}`,
        });
      },
    );
  }
});

/**
 * Handles removing a user's rating.
 *
 * @function
 * @name removeUserRating
 *
 * @param {Object} req - Express.js request object with a JSON body containing 'username' and 'userRated'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/rate'
 * // Request body should contain a JSON object with 'username' and 'userRated' fields.
 * const requestPayload = {
 *   "username": "currentUser",
 *   "userRated": "ratedUser"
 * };
 */
router.delete("/rate", function (req, res) {
  const { username, userRated } = req.body;

  db.run(
    "DELETE FROM Ratings WHERE (Username, UserRated) = (?, ?)",
    [username, userRated],
    (err, row) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({
        message: `${username} successfully removed their rating of ${userRated}`,
      });
    },
  );
});

/**
 * GET request endpoint at /api/ratings for retrieving a list of ratings.
 *
 * @function
 * @name getRatings
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/ratings'
 * const ratingsResponse = await fetch(`${serverIp}/api/ratings`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 * });
 *
 * if (ratingsResponse.status === 200) {
 *     const ratingsData = await ratingsResponse.json();
 *     console.log("List of Ratings:", ratingsData.Ratings);
 * }
 */
router.get("/ratings", function (req, res) {
  // Query the database for a list of ratings
  db.all("SELECT * FROM Ratings", (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Respond with a JSON array of ratings
    return res.status(200).json({ Ratings: rows });
  });
});

/**
 * Handles retrieving a user's profile, including ratings, listings, and liked listings.
 *
 * @function
 * @async
 * @name getUserProfile
 *
 * @param {Object} req - Express.js request object with a 'username' query parameter.
 * @param {Object} res - Express.js response object.
 *
 * @throws {Error} If there's an error during the database queries.
 *
 * @example
 * // Sample HTTP GET request to '/api/profile?username=currentUser'
 * // The 'username' query parameter specifies the user's profile to retrieve.
 */
router.get("/profile", async function (req, res) {
  const username = req.query.username;

  if (!username)
    return res.status(409).json({ error: "Username not provided" });

  try {
    // check if user exists
    const userResult = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM Accounts WHERE Username = ?",
        [username],
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (first query):", err);
            reject(err);
          }
          resolve(rows);
        },
      );
    });
    if (!userResult)
      return res.status(404).json({ error: `User ${username} not found` });

    // get the ratings belonging to the user
    const ratingsResult = await new Promise((resolve, reject) => {
      db.all(
        "SELECT AVG(Rating) AS AverageRating, COUNT(Rating) AS RatingCount FROM Ratings WHERE UserRated = ?",
        [username],
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (second query):", err);
            reject(err);
          }
          resolve(rows);
        },
      );
    });

    // get the user's posted listings
    const userListingsResult = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM Listings WHERE Username = ? ORDER BY ListingId DESC",
        [username],
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (third query):", err);
            reject(err);
          }
          resolve(rows);
        },
      );
    });

    // get the user's liked listings
    const likedListingsResult = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM Listings WHERE ListingId IN (SELECT ListingId FROM Likes WHERE Username = ?) ORDER BY ListingId DESC",
        [username],
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (fourth query):", err);
            reject(err);
          }
          resolve(rows);
        },
      );
    });

    // append the images to both
    const likedListings = await getImagesFromListings(
      likedListingsResult,
      likedListingsResult,
    );
    const userListings = await getImagesFromListings(
      userListingsResult,
      likedListingsResult,
    );

    return res.status(200).json({
      likedListings: likedListings,
      userListings: userListings,
      ratings: ratingsResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router
module.exports = router;
