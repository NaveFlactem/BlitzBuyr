/** API endpoints related to Listings.
 * @module API/Listings
 */

const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
const db = require('./db').db;
const multer = require('multer');
const sharp = require('sharp');
const { encode } = require('blurhash');
const path = require('path');

/** Encodes an image to Blurhash format.
 *
 * @function
 * @async
 * @name encodeImageToBlurhash
 *
 * @param {string} path - The path to the image file.
 * @returns {Promise<string>} A Promise that resolves to the Blurhash string.
 * @throws {Error} If there's an error processing the image.
 */
const encodeImageToBlurhash = async (path) => {
  try {
    const { data: buffer, info: metadata } = await sharp(path)
      .raw()
      .ensureAlpha()
      .resize(64, 64, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    const { width, height } = metadata;
    const hash = encode(new Uint8ClampedArray(buffer), width, height, 4, 4);
    return hash;
  } catch (err) {
    throw new Error(`Error processing image: ${err.message}`);
  }
};

/** Storage configuration for multer to handle image uploads.
 * @constant {Object} imageStorage
 * @property {string} destination - The directory where uploaded files will be stored.
 * @property {Function} filename - Generates a unique filename for each uploaded file.
 */
const imageStorage = multer.diskStorage({
  destination: './img/', // Set the directory where uploaded files will be stored
  filename: (req, file, callback) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

/** Multer configuration for handling image uploads.
 * @constant {Object} imageUpload
 * @property {Object} storage - The storage configuration for multer.
 * @property {Object} limits - The limits for uploaded files, such as file size.
 */
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).any();

/** Storage configuration for multer to handle image uploads.
 * @constant {Object} imageStorage
 * @property {string} destination - The directory where uploaded files will be stored.
 * @property {Function} filename - Generates a unique filename for each uploaded file.
 */
const getCityFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    );
    const data = await response.json();
    return data.address.city || 'Unknown';
  } catch (error) {
    console.error('Error getting city:', error);
    return 'Unknown';
  }
};

/** POST request endpoint for creating a new listing.
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
router.post('/createListing', imageUpload, async function (req, res) {
  const {
    price,
    title,
    description,
    username,
    tags,
    location,
    condition,
    transactionPreference,
    currency,
    currencySymbol,
  } = req.body;
  const { latitude, longitude } = JSON.parse(location);
  const city = await getCityFromCoords(latitude, longitude);
  const images = req.files;
  const sqlTimeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  console.log(`Create Listing: ${JSON.stringify(req.body)}`);

  try {
    // Insert the listing into the Listings table
    db.run(
      `INSERT INTO Listings 
      (price, title, description, userName, postDate, latitude, longitude, city, condition, transactionPreference, currency, currencySymbol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      price,
      title,
      description,
      username,
      sqlTimeStamp,
      latitude,
      longitude,
      city,
      condition,
      transactionPreference,
      currency,
      currencySymbol,
      function (err) {
        if (err) {
          console.log('Error querying the database:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const listingId = this.lastID;
        const componentX = req.body.componentX ?? 4;
        const componentY = req.body.componentY ?? 3;

        // Loop through tags and insert them into the "Tags" table if they don't exist
        JSON.parse(tags).forEach((tag) => {
          db.run(
            'INSERT OR IGNORE INTO Tags (TagName) VALUES (?)',
            [tag],
            (err) => {
              if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Get the TagId for the inserted or existing tag
              db.get(
                'SELECT TagId FROM Tags WHERE TagName = ?',
                [tag],
                (err, tagRow) => {
                  if (err) {
                    console.error('Error querying the database:', err);
                    return res
                      .status(500)
                      .json({ error: 'Internal Server Error' });
                  }

                  const tagId = tagRow.TagId;

                  // Associate the tag with the listing in the "ListingTags" table
                  db.run(
                    'INSERT INTO ListingTags (ListingId, TagId, TagName) VALUES (?, ?, ?)',
                    [listingId, tagId, tagRow.TagName],
                    (err) => {
                      if (err) {
                        console.error('Error querying the database:', err);
                        return res
                          .status(500)
                          .json({ error: 'Internal Server Error' });
                      }
                      // Tag associated with the listing successfully
                    },
                  );
                },
              );
            },
          );
        });

        // Insert images into the Images table
        if (images.length > 0) {
          images.forEach(async (image) => {
            const imagePath = 'img/' + image.filename;
            const hash = await encodeImageToBlurhash(imagePath, image.filename);
            console.log('hash:', hash);

            db.run(
              'INSERT INTO Images (listingId, ImageURI, BlurHash) VALUES (?, ?, ?)',
              [listingId, image.filename, hash],
              (err) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
                }
              },
            );
          });
        }
        return res.status(201).json({
          message: 'Listing created successfully',
          listingId: listingId,
        });
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

/** GET request endpoint at /api/listings for retrieving a list of all listings.
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
router.get('/listings', async function (req, res) {
  const {
    username,
    tags,
    latitude,
    longitude,
    distance,
    conditions,
    transactions,
    currency,
  } = req.query;

  try {
    let query = `
      SELECT
        Listings.*,
        GROUP_CONCAT(DISTINCT Tags.TagName) AS tags,
        GROUP_CONCAT(DISTINCT Images.ImageURI) AS images,
        GROUP_CONCAT(DISTINCT Images.BlurHash) AS blurhashes,
        Profiles.ProfilePicture,
        COALESCE((
          SELECT 1 
          FROM Likes 
          WHERE Likes.ListingId = Listings.ListingId AND Likes.Username = '${username}'
          LIMIT 1
        ), 0) AS liked,
        COALESCE((
          SELECT AVG(Rating) 
          FROM Ratings 
          WHERE Ratings.UserRated = Listings.Username
        ), null) AS averageRating,
        COALESCE((
          SELECT COUNT(Rating) 
          FROM Ratings 
          WHERE Ratings.UserRated = Listings.Username
        ), null) AS ratingCount`;
    if (distance)
      query += `-- Calculate distance using Haversine formula
        ,(3958.8 * acos(cos(radians(${latitude})) * cos(radians(Listings.Latitude)) * cos(radians(Listings.Longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(Listings.Latitude)))) AS distance`;
    query += `
      FROM Listings
      LEFT JOIN ListingTags ON Listings.ListingId = ListingTags.ListingId
      LEFT JOIN Tags ON ListingTags.TagId = Tags.TagId
      LEFT JOIN Images ON Listings.ListingId = Images.ListingId
      LEFT JOIN Profiles ON Profiles.Username = Listings.Username
      WHERE PostDate >= datetime('now', '-14 days')`;

    if (tags) {
      query += `
          AND Tags.TagName IN (${tags.map((tag) => `'${tag}'`).join(',')})
        `;
    }
    if (conditions) {
      query += `
          AND Listings.Condition IN (${conditions
            .map((condition) => `'${condition}'`)
            .join(',')})
        `;
    }
    if (transactions) {
      query += `
          AND Listings.TransactionPreference IN (${transactions
            .map((transaction) => `'${transaction}'`)
            .join(',')})
        `;
    }

    if (distance) {
      query += `
          AND distance <= ${distance}
        `;
    }

    if (currency) {
      query += `
          AND Listings.Currency = '${currency}'
        `;
    }

    query += `
      GROUP BY Listings.ListingId
      ORDER BY Listings.ListingId DESC;
    `;

    // Execute the query
    const rows = await new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          console.error('Error querying the database:', err);
          reject(err);
        }
        resolve(rows);
      });
    });

    const pfp = await new Promise((resolve, reject) =>
      db.get(
        'SELECT ProfilePicture FROM Profiles WHERE Username = ?',
        [username],
        (err, row) => {
          if (err) {
            console.error('Error querying the database:', err);
            reject(err);
          }
          resolve(row);
        },
      ),
    );

    // Parse the rows
    const parsedRows = rows.map((row) => {
      const { averageRating, ratingCount, ...rest } = row;
      const images = row.images ? row.images.split(',') : [];
      const blurhashes = row.blurhashes ? row.blurhashes.split(',') : [];

      const imagesWithBlurhashes = images.map((uri, i) => {
        return {
          uri,
          blurhash: blurhashes[i],
        };
      });
      return {
        ...rest,
        tags: row.tags ? row.tags.split(',') : [],
        images: imagesWithBlurhashes,
        liked: Boolean(row.liked),
        ratings: {
          averageRating: row.averageRating
            ? parseFloat(row.averageRating.toFixed(1))
            : row.averageRating,
          ratingCount: row.ratingCount,
        },
      };
    });

    return res.status(200).json(parsedRows);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/** Handles deleting of accounts.
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
router.delete('/deletelistings', function (req, res) {
  const listingId = req.query.listingId;

  if (listingId) {
    db.run('DELETE FROM Listings WHERE ListingId = ?', [listingId], (err) => {
      if (err) {
        console.error(`Error deleting listing ${listingId}:`, err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: `Listing ${listingId} deleted` });
    });
  } else {
    db.run('DELETE FROM Listings', (err) => {
      if (err) {
        console.error('Error deleting all listings:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'All listings deleted' });
    });
  }
});

/** GET request endpoint at /api/images for retrieving a list of all images or a list of images belonging to a specific listing using the 'listingId' query parameter.
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
router.get('/images', function (req, res) {
  const listingId = req.query.listingId;

  if (listingId) {
    // If 'listingId' is provided as a query parameter, retrieve images for that listing.
    db.all(
      'SELECT * FROM Images WHERE ListingId = ?',
      [listingId],
      (err, rows) => {
        if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ Images: rows });
      },
    );
  } else {
    // If 'listingId' is not provided, retrieve all images.
    db.all('SELECT * FROM Images ORDER BY ImageId DESC', function (err, rows) {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.status(200).json({ Images: rows });
    });
  }
});

/** Handles deleting images.
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
router.delete('/deleteimages', function (req, res) {
  const imageId = req.query.imageId;

  if (imageId) {
    db.run('DELETE FROM Images WHERE ImageId = ?', [imageId], (err) => {
      if (err) {
        console.error(`Error deleting image ${imageId}:`, err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: `image ${imageId} deleted` });
    });
  } else {
    db.run('DELETE FROM images', (err) => {
      if (err) {
        console.error('Error deleting all images:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'All images deleted' });
    });
  }
});

/** Handles deleting a listing.
 *
 * @function
 * @name handleDeleteListing
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/deletelisting'
 * const deleteListingResponse = await fetch(`${serverIp}/api/deletelisting`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify({ username: "sampleUser", password: "samplePassword", listingId: 123 }),
 *   });
 *
 * if (deleteListingResponse.status === 200) {
 *     const deleteListingData = await deleteListingResponse.json();
 *     console.log("Listing deleted:", deleteListingData.message);
 * } else {
 *     console.log("Error deleting listing");
 * }
 */
router.delete('/deletelisting', async function (req, res) {
  const { username, password, listingId } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM Accounts WHERE Username = ? AND Password = ?',
        [username, password],
        (err, row) => {
          if (err) {
            console.error('Error querying the database:', err);
            reject(err);
          }
          resolve(row);
        },
      );
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    db.run(
      'DELETE FROM Listings WHERE ListingId = ? AND Username = ?',
      [listingId, username],
      (err, rows) => {
        if (err) {
          console.error(`Error deleting listing ${listingId}:`, err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (this.changes === 0) {
          return res
            .status(401)
            .json({ error: 'Invalid listing or credentials' });
        }
        return res
          .status(200)
          .json({ message: `Listing ${listingId} deleted` });
      },
    );
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = { router, imageStorage, imageUpload };
