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
 * POST request endpoint for creating a new listing.
 * @function
 * @name createListing
 * @param {Object} req - Express.js request object with a JSON body containing 'price', 'images', 'title', 'description', and 'userName'.
 * @param {Object} res - Express.js response object.
 * @example
 * // Sample HTTP POST request to '/api/createListing'
 * // Request body should contain a JSON object with the required fields.
 * const requestPayload = {
 *   "price": 100.0,
 *   "images": [image1_in_binary, image2_in_binary],
 *   "title": "Sample Listing",
 *   "description": "This is a sample listing.",
 *   "userName": "sampleUser"
 * };
 */
router.post("/createListing", function (req, res) {
  const { price, images, title, description, username } = req.body;

  const sqlTimeStamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  // Insert the listing into the Listings table
  db.run(
    "INSERT INTO Listings (price, title, description, userName, postDate) VALUES (?, ?, ?, ?, ?)",
    [price, title, description, username, sqlTimeStamp],
    (err) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Insert images into the Images table
      images.forEach((image) => {
        db.run(
          "INSERT INTO Images (listingId, imageData) VALUES (?, ?)",
          [listingId, image],
          (err) => {
            if (err) {
              console.error("Error querying the database:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
          }
        );
      });

      return res.status(201).json({ message: "Listing created successfully" });
    }
  );
});

/**
 * GET request endpoint at /api/listings for retrieving a list of all listings.
 * @function
 * @name getListings
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
router.get("/listings", function (req, res) {
  db.all("SELECT * FROM Listings", (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json({ Listings: rows });
  });
});

// Export the router
module.exports = router;
