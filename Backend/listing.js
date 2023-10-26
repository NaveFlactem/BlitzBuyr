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
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: "./img/", // Set the directory where uploaded files will be stored
  filename: (req, file, callback) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
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
router.post("/createListing", imageUpload, function (req, res) {
  const { price, title, description, username } = req.body;
  const images = req.files;

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
            // console.log(image);
            const imagePath = "img/" + image.filename;

            db.run(
              "INSERT INTO Images (listingId, ImageURI) VALUES (?, ?)",
              [listingId, image.filename],
              (err) => {
                if (err) {
                  console.error("Error querying the database:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }
                // console.log(`Inserted image ${image.originalname}`);
              }
            );
          });
        }
        return res.status(201).json({
          message: "Listing created successfully",
          listingId: listingId,
        });
      }
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
router.get("/listings", async function (req, res) {
  try {
    const listingsResult = await new Promise((resolve, reject) => {
      // First query
      db.all("SELECT * FROM Listings ORDER BY ListingId DESC", (err, rows) => {
        if (err) {
          console.error("Error querying the database (first query):", err);
          reject(err);
        }
        resolve(rows);
      });
    });
    
    const imagesResult = await new Promise((resolve, reject) => {
      // Extract the ListingIds from listingsResult
      const listingIds = listingsResult.map((listing) => listing.ListingId);
    
      if (listingIds.length === 0) {
        // If there are no ListingIds, there's no need to query the Images table.
        resolve([]);
      } else {
        // Generate placeholders for the IN clause based on the number of ListingIds
        const placeholders = listingIds.map(() => '?').join(', ');
    
        // Second query using placeholders for the IN clause
        db.all(
          `SELECT * FROM Images i WHERE i.ListingId IN (${placeholders})`,
          listingIds,
          (err, rows) => {
            if (err) {
              console.error("Error querying the database (second query):", err);
              reject(err);
            }
            resolve(rows);
          }
        );
      }
    });

    const combinedData = listingsResult.map((listing) => {
      const matchingImages = imagesResult
        .filter((image) => image.ListingId === listing.ListingId)
        .map((image) => image.ImageURI);
      return {
        ...listing, // Include all properties from the listing
        images: matchingImages, // Add the matching images
      };
    });

    // Now combinedData contains the desired format where each listing includes its images
    console.log(combinedData);

    // Now you can use both firstQueryResult and secondQueryResult
    return res.status(200).json({
      Listings: firstQueryResult,
      AnotherTableData: secondQueryResult,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Handles deleting of accounts.
 * @name handleDeleteListings
 * @function
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
router.delete("/deletelistings", function (req, res) {
  const listingId = req.query.listingId;

  if (listingId) {
    db.run("DELETE FROM Listings WHERE ListingId = ?", [listingId], (err) => {
      if (err) {
        console.error(`Error deleting listing ${listingId}:`, err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: `Listing ${listingId} deleted` });
    });
  } else {
    db.run("DELETE FROM Listings", (err) => {
      if (err) {
        console.error("Error deleting all listings:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: "All listings deleted" });
    });
  }
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
      }
    );
  } else {
    // If 'listingId' is not provided, retrieve all images.
    db.all("SELECT * FROM Images ORDER BY ImageId DESC", function (err, rows) {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({ Images: rows });
    });
  }
});

/**
 * Handles deleting of accounts.
 * @name handleDeleteimages
 * @function
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
router.delete("/deleteimages", function (req, res) {
  const imageId = req.query.imageId;

  if (imageId) {
    db.run("DELETE FROM Images WHERE ImageId = ?", [imageId], (err) => {
      if (err) {
        console.error(`Error deleting image ${imageId}:`, err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: `image ${imageId} deleted` });
    });
  } else {
    db.run("DELETE FROM images", (err) => {
      if (err) {
        console.error("Error deleting all images:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: "All images deleted" });
    });
  }
});

// Export the router
module.exports = router;
