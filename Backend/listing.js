/**
 * Express application for serving static files and handling API requests.
 * @module API
 */

const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
const db = require("./db").db;
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Adjust the file size limit as needed
  },
}).any(); // Use upload.any() to accept any type of field

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
router.post("/createListing", upload, function (req, res) {
  const { price, title, description, username } = req.body;
  const images = req.files;
  //console.log(
  //`price: ${price}\nimages: ${images}\ntitle: ${title}\ndescription: ${description}\nUserName: ${username}`
  //);

  const sqlTimeStamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    // Insert the listing into the Listings table
    db.run(
      "INSERT INTO Listings (price, title, description, userName, postDate) VALUES (?, ?, ?, ?, ?)",
      [price, title, description, username, sqlTimeStamp],
      function (err) {
        if (err) {
          console.error("Error querying the database:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const listingId = this.lastID;

        // Insert images into the Images table
        if (images.length > 0) {
          images.forEach((image) => {
            db.run(
              "INSERT INTO Images (listingId, imageData) VALUES (?, ?)",
              [listingId, image.buffer.toString("base64")],
              (err) => {
                if (err) {
                  console.error("Error querying the database:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }
                // console.log(`Inserted image ${image.originalname}`);
              },
            );
          });
        }
        return res.status(201).json({
          message: "Listing created successfully",
          listingId: listingId,
        });
      },
    );
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

/**
 * GET request endpoint at /api/listings for retrieving a list of all listings.
 * @function
 * @name getListings
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
router.get("/listings", function (req, res) {
  db.all(
    "SELECT * FROM Listings ORDER BY ListingId DESC",
    function (err, rows) {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({ Listings: rows });
    },
  );
});

/**
 * GET request endpoint at /api/images for retrieving a list of all images or a list of images belonging to a specific listing using the 'listingId' query parameter.
 * @function
 * @name getImages
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
router.get("/images", function (req, res) {
  const listingId = req.query.listingId;

  if (listingId) {
    // If 'listingId' is provided as a query parameter, retrieve images for that listing.
    db.all(
      "SELECT * FROM Images WHERE ListingId = ?",
      [listingId],
      (err, rows) => {
        if (err) {
          console.error("Error querying the database:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json({ Images: rows });
      },
    );
  } else {
    // If 'listingId' is not provided, retrieve all images.
    db.all("SELECT * FROM Images", function (err, rows) {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({ Images: rows });
    });
  }
});

// Export the router
module.exports = router;
