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
const sharp = require("sharp");
const { encode } = require("blurhash");
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
 *
 * @function
 * @name createListing
 *
 * @param {Object} req - Express.js request object with a JSON body containing 'price', 'images', 'title', 'description', and 'userName'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/createListing'
 * const requestPayload = {
 *   "price": 100.0,
 *   "images": [image1_in_binary, image2_in_binary],
 *   "title": "Sample Listing",
 *   "description": "This is a sample listing.",
 *   "userName": "sampleUser"
 * };
 * const createListingResponse = await fetch(`${serverIp}/api/createListing`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify(requestPayload),
 *   });
 *
 * if (createListingResponse.status === 201) {
 *     const responsePayload = await createListingResponse.json();
 *     console.log("Listing created successfully with ID:", responsePayload.listingId);
 * } else {
 *     console.log("Error creating listing");
 * }
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
        const componentX = req.body.componentX ?? 4;
        const componentY = req.body.componentY ?? 3;
        //TOMMY CODE==========================================================
        const tags = req.body.tags || [];
        // Loop through tags and insert them into the "Tags" table if they don't exist
        tags.forEach((tag) => {
          db.run(
            "INSERT OR IGNORE INTO TagDetails (TagName) VALUES (?)",
            [tag],
            (err) => {
              if (err) {
                console.error("Error querying the database:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              // Get the TagId for the inserted or existing tag
              db.get(
                "SELECT TagId FROM Tags WHERE TagName = ?",
                [tag],
                (err, tagRow) => {
                  if (err) {
                    console.error("Error querying the database:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }

                  const tagId = tagRow.TagId;

                  // Associate the tag with the listing in the "ListingTags" table
                  db.run(
                    "INSERT INTO TagTable (ListingId, TagId) VALUES (?, ?)",
                    [listingId, tagId],
                    (err) => {
                      if (err) {
                        console.error("Error querying the database:", err);
                        return res.status(500).json({ error: "Internal Server Error" });
                      }
                      // Tag associated with the listing successfully
                    }
                  );
                }
              );
            }
          );
        });
        //END OF TOMMY CODE
        // Insert images into the Images table
        if (images.length > 0) {
          images.forEach(async (image) => {
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
 *
 * @function
 * @name getListings
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/listings'
 * const listingsResponse = await fetch(`${serverIp}/api/listings`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (listingsResponse.status === 200) {
 *     const listingsData = await listingsResponse.json();
 *     console.log("List of Listings:", listingsData);
 * } else {
 *     console.log("Error retrieving listings");
 * }
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

    const username = req.query.username;
    const likedListingsResult = await new Promise((resolve, reject) => {
      // First query
      db.all(
        "SELECT ListingId FROM Likes WHERE Username = ? ORDER BY ListingId DESC",
        [username],
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (second query):", err);
            reject(err);
          }
          resolve(rows);
        }
      );
    });

    // Now you can use both firstQueryResult and secondQueryResult
    return res
      .status(200)
      .json(await getImagesFromListings(listingsResult, likedListingsResult));
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Handles deleting of accounts.
 *
 * @function
 * @name handleDeleteListings
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/deletelistings'
 * const deleteListingsResponse = await fetch(`${serverIp}/api/deletelistings`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (deleteListingsResponse.status === 200) {
 *     const deleteListingsData = await deleteListingsResponse.json();
 *     console.log("Listings deleted:", deleteListingsData.message);
 * } else {
 *     console.log("Error deleting listings");
 * }
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
 *
 * @function
 * @name getImages
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/images?listingId=123'
 * const getImagesResponse = await fetch(`${serverIp}/api/images?listingId=123`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (getImagesResponse.status === 200) {
 *     const imagesData = await getImagesResponse.json();
 *     console.log("Images:", imagesData.Images);
 * } else {
 *     console.log("Error retrieving images");
 * }
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
 *
 * @function
 * @name handleDeleteImages
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/deleteimages'
 * const deleteImagesResponse = await fetch(`${serverIp}/api/deleteimages`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (deleteImagesResponse.status === 200) {
 *     const deleteImagesData = await deleteImagesResponse.json();
 *     console.log("Images deleted:", deleteImagesData.message);
 * } else {
 *     console.log("Error deleting images");
 * }
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

/**
 * Retrieves images associated with listings and combines them with listing data.
 *
 * @function
 * @async
 * @name getImagesFromListings
 *
 * @param {Array} listingsResult - An array of listing objects to retrieve images for.
 *
 * @returns {Promise<Array>} A Promise that resolves to an array of combined data objects. Each combined object includes listing information, associated images, and a flag indicating whether the listing is liked.
 *
 * @throws {Error} If there's an error during the database query.
 */
getImagesFromListings = async (listingsResult, likedListingsResult) => {
  const imagesResult = await new Promise((resolve, reject) => {
    const listingIds = listingsResult.map((listing) => listing.ListingId);
    if (listingIds.length === 0) {
      resolve([]);
    } else {
      const placeholders = listingIds.map(() => "?").join(", ");
      db.all(
        `SELECT * FROM Images i WHERE i.ListingId IN (${placeholders})`,
        listingIds,
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (third query):", err);
            reject(err);
          }
          resolve(rows);
        }
      );
    }
  });

  // Fetch ratings for each listing's username
  const ratingsResult = await new Promise((resolve, reject) => {
    const usernames = listingsResult.map((listing) => listing.Username);
    if (usernames.length === 0) {
      resolve([]);
    } else {
      const placeholders = usernames.map(() => "?").join(", ");
      db.all(
        `SELECT UserRated, AVG(Rating) AS AverageRating, COUNT(*) AS RatingCount FROM Ratings WHERE UserRated IN (${placeholders}) GROUP BY UserRated`,
        usernames,
        (err, rows) => {
          if (err) {
            console.error("Error querying the database (ratings query):", err);
            reject(err);
          }
          resolve(rows);
        }
      );
    }
  });

  const combinedData = listingsResult.map((listing) => {
    const isLiked = likedListingsResult.some(
      (likedListing) => likedListing.ListingId === listing.ListingId
    );
    const matchingImages = imagesResult
      .filter((image) => image.ListingId === listing.ListingId)
      .map((image) => image.ImageURI);

    // Get the ratings for the listing's username
    const usernameRatings = {};
    ratingsResult.forEach((rating) => {
      if (rating.UserRated === listing.Username) {
        usernameRatings.averageRating = rating.AverageRating;
        usernameRatings.ratingCount = rating.RatingCount;
      }
    });

    return {
      ...listing,
      images: matchingImages,
      liked: isLiked,
      ratings: usernameRatings, // Add the ratings for the listing's username
    };
  });

  return combinedData;
};

// Export the router
module.exports = { router, getImagesFromListings, imageStorage, imageUpload };
