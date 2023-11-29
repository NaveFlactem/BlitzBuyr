/** API Endpoints related to user Profiles.
 * @module API/Profile
 */

const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
const db = require('./db').db;
const { imageUpload } = require('./listing');
const { authenticateUser } = require('./account'); // FIXME: Use this like, everywhere

/** Handles a user liking a listing.
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
router.post('/like', function (req, res) {
  const { username, listingId } = req.body;

  db.run(
    'INSERT INTO Likes (Username, ListingId) VALUES (?, ?)',
    [username, listingId],
    (err, row) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({
        message: `${username} successfully liked listing ${listingId}`,
      });
    }
  );
});

/** Handles a user unliking a listing.
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
router.delete('/like', function (req, res) {
  const { username, listingId } = req.body;

  db.run(
    'DELETE FROM Likes WHERE (Username, ListingId) = (?, ?)',
    [username, listingId],
    (err) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({
        message: `${username} successfully unliked listing ${listingId}`,
      });
    }
  );
});

/** GET request endpoint at /api/likes for retrieving a list of likes.
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
router.get('/likes', function (req, res) {
  // Query the database for a list of likes
  db.all('SELECT * FROM Likes', (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Respond with a JSON array of likes
    return res.status(200).json({ Likes: rows });
  });
});

/** DELETE request endpoint at /api/likes for deleting all likes.
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
router.delete('/likes', function (req, res) {
  db.run('DELETE FROM Likes', (err) => {
    if (err) {
      console.error('Error deleting all likes:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ message: 'All likes deleted' });
  });
});

/** Handles rating a user.
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
router.post('/rate', async function (req, res) {
  const { username, userRated, rating } = req.body;

  // Check if user is already rated
  const ratingResult = await new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM Ratings WHERE Username = ? AND UserRated = ?',
      [username, userRated],
      (err, row) => {
        if (err) {
          console.error('Error querying the database (check if rated):', err);
          reject(err);
        }
        resolve(row);
      }
    );
  });

  if (ratingResult) {
    // User has already rated, update the rating
    db.run(
      'UPDATE Ratings SET Rating = ? WHERE Username = ? AND UserRated = ?',
      [rating, username, userRated],
      (err) => {
        if (err) {
          console.error('Error updating the rating:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({
          message: `${username} updated the rating for ${userRated} to ${rating}`,
        });
      }
    );
  } else {
    // User has not rated, insert a new rating
    db.run(
      'INSERT INTO Ratings (Username, UserRated, Rating) VALUES (?, ?, ?)',
      [username, userRated, rating],
      (err, row) => {
        if (err) {
          console.error('Error inserting the rating:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({
          message: `${username} successfully rated ${userRated} with ${rating}`,
        });
      }
    );
  }
});

/** DELETE request endpoint at /api/rate for deleting a rating.
 *
 * @function
 * @name deleteRating
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/rate'
 * const deleteRatingData = {
 *     username: "testuser",
 *     userRated: "rateduser",
 *   };
 * const deleteRatingResponse = await fetch(`${serverIp}/api/rate`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify(deleteRatingData),
 *   });
 *
 * if (deleteRatingResponse.status > 201) {
 *     console.log("Error Deleting Rating:", deleteRatingResponse.status);
 * }
 */
router.delete('/rate', function (req, res) {
  const { username, userRated } = req.body;

  db.run(
    'DELETE FROM Ratings WHERE (Username, UserRated) = (?, ?)',
    [username, userRated],
    (err, row) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({
        message: `${username} successfully removed their rating of ${userRated}`,
      });
    }
  );
});

/** GET request endpoint at /api/ratings for retrieving a list of ratings.
 *
 * @function
 * @name getRatings
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/ratings'
 * const ratingsResponse = await fetch(`${serverIp}/api/ratings`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (ratingsResponse.status === 200) {
 *     const ratingsData = await ratingsResponse.json();
 *     console.log("List of Ratings:", ratingsData.Ratings);
 * }
 */
router.get('/ratings', function (req, res) {
  const { username } = req.query;

  if (username) {
    // If a username was provided in the query, return the AverageRating and RatingCount of the user's Profile
    // Query the database for the user's ratings
    db.get(
      'SELECT AVG(Rating) AS AverageRating, COUNT(*) AS RatingCount FROM Ratings WHERE UserRated = ?',
      [username],
      (err, row) => {
        if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Respond with the user's ratings data
        return res.status(200).json({
          AverageRating: row.AverageRating,
          RatingCount: row.RatingCount,
        });
      }
    );
  } else {
    // If no username was provided, return all ratings in the db
    // Query the database for a list of all ratings
    db.all('SELECT * FROM Ratings', (err, rows) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Respond with a JSON array of all ratings
      return res.status(200).json({ Ratings: rows });
    });
  }
});

/** Handles retrieving a user's profile, including ratings, listings, and liked listings.
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
router.get('/profile', async function (req, res) {
  const { username, password, profileName } = req.query;

  if (!(await authenticateUser(username, password)))
    return res
      .status(409)
      .json({ error: 'Failed to authenticate with your credentials' });

  if (!profileName)
    return res.status(409).json({ error: `Profile Name not provided` });

  try {
    // check if user exists
    const userResult = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM Accounts WHERE Username = ?',
        [profileName],
        (err, rows) => {
          if (err) {
            console.error('Error querying the database (first query):', err);
            reject(err);
          }
          resolve(rows);
        }
      );
    });
    if (!userResult || userResult.length == 0)
      return res.status(404).json({ error: `User ${profileName} not found` });

    let combinedListingsQuery = `
      SELECT
        Listings.*,
        GROUP_CONCAT(DISTINCT Tags.TagName) AS tags,
        GROUP_CONCAT(DISTINCT Images.ImageURI) AS images,
        GROUP_CONCAT(DISTINCT Images.BlurHash) AS blurhashes,
        Profiles.ProfilePicture,
        COALESCE((
          SELECT 1 
          FROM Likes 
          WHERE Likes.ListingId = Listings.ListingId AND Likes.Username = '${profileName}'
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
        ), null) AS ratingCount
      FROM Listings
      LEFT JOIN ListingTags ON Listings.ListingId = ListingTags.ListingId
      LEFT JOIN Tags ON ListingTags.TagId = Tags.TagId
      LEFT JOIN Images ON Listings.ListingId = Images.ListingId
      LEFT JOIN Profiles ON Profiles.Username = Listings.Username
      WHERE (Listings.ListingId IN (
        SELECT ListingId
        FROM Likes
        WHERE Likes.Username = '${profileName}'
      ))
      OR (Listings.Username = '${profileName}')
      GROUP BY Listings.ListingId
      ORDER BY Listings.ListingId DESC;`;
    const rows = await new Promise((resolve, reject) => {
      db.all(combinedListingsQuery, (err, rows) => {
        if (err) {
          console.error('Error querying the database:', err);
          reject(err);
        }
        resolve(rows);
      });
    });
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

    // get the ratings belonging to the user
    const ratingsResult = await new Promise((resolve, reject) => {
      db.all(
        'SELECT AVG(Rating) AS AverageRating, COUNT(Rating) AS RatingCount FROM Ratings WHERE UserRated = ?',
        [profileName],
        (err, rows) => {
          if (err) {
            console.error('Error querying the database (second query):', err);
            reject(err);
          }
          resolve(rows);
        }
      );
    });

    // get the user's contact info and settings
    const contactResult = await new Promise((resolve, reject) => {
      db.get(
        `SELECT ContactInfo.*, Settings.HidePhone, Settings.HideEmail, Settings.HideLinkedIn, Settings.HideInstagram, Settings.HideFacebook, Settings.HideTwitter
    FROM ContactInfo
    INNER JOIN Settings ON ContactInfo.Username = Settings.Username
    WHERE ContactInfo.Username = ?`,
        [profileName], // Replace with the specific username you want to retrieve
        (err, row) => {
          if (err) {
            console.error('Error querying the database:', err);
            reject(err);
          }
          resolve(row);
        }
      );
    });

    if (!contactResult || contactResult.length == 0)
      return res
        .status(404)
        .json({ error: `Contact info for ${profileName} not found` });

    // Parse the result FIXME: make this prettier
    const contactInfo = {
      phone: {
        data:
          profileName !== contactResult.Username && contactResult.HidePhone
            ? null
            : contactResult.Phone,
        hidden: contactResult.HidePhone,
      },
      email: {
        data:
          profileName !== contactResult.Username && contactResult.HideEmail
            ? null
            : contactResult.Email,
        hidden: contactResult.HideEmail,
      },
      linkedIn: {
        data:
          profileName !== contactResult.Username && contactResult.HideLinkedIn
            ? null
            : contactResult.LinkedIn,
        hidden: contactResult.HideLinkedIn,
      },
      instagram: {
        data:
          profileName !== contactResult.Username && contactResult.HideInstagram
            ? null
            : contactResult.Instagram,
        hidden: contactResult.HideInstagram,
      },
      facebook: {
        data:
          profileName !== contactResult.Username && contactResult.HideFacebook
            ? null
            : contactResult.Facebook,
        hidden: contactResult.HideFacebook,
      },
      twitter: {
        data:
          profileName !== contactResult.Username && contactResult.HideTwitter
            ? null
            : contactResult.Twitter,
        hidden: contactResult.HideTwitter,
      },
    };

    // Get the profile and cover pictures
    let profilePictureResult = await new Promise((resolve, reject) => {
      db.all(
        'SELECT ProfilePicture, CoverPicture FROM Profiles WHERE Username = ?',
        [profileName],
        (err, rows) => {
          if (err) {
            console.error('Error querying the database (fourth query):', err);
            reject(err);
          }
          resolve(rows);
        }
      );
    });

    return res.status(200).json({
      likedListings: parsedRows.filter((listing) => listing.liked == true),
      userListings: parsedRows.filter(
        (listing) => listing.Username === profileName
      ),
      ratings: ratingsResult,
      profilePicture: profilePictureResult[0].ProfilePicture,
      coverPicture: profilePictureResult[0].CoverPicture,
      email: userResult[0].Email,
      contactInfo: contactInfo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/** GET request endpoint at /api/pfp for retrieving a user's profile picture.
 *
 * @function
 * @name getProfilePicture
 *
 * @param {Object} req - Express.js request object with a 'username' query parameter.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/pfp?username=testuser'
 * const pfpResponse = await fetch(`${serverIp}/api/pfp?username=testuser`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 * });
 *
 * if (pfpResponse.status === 200) {
 *     // Profile picture is available in the response
 *     console.log("Profile Picture:", pfpResponse.url);
 * }
 */
router.get('/pfp', function (req, res) {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  db.get(
    'SELECT ProfilePicture FROM Profiles WHERE Username = ?',
    [username],
    (err, row) => {
      if (err || !row) {
        console.error('Error fetching the pfp:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // return the image in the result's URI
      res.redirect(row.ProfilePicture);
    }
  );
});

/** POST request endpoint at /api/editprofile for updating a user's profile information.
 *
 * @function
 * @name updateProfile
 *
 * @param {Object} req - Express.js request object with form data containing 'username', 'contactInfo', 'profileName', 'password', 'profilePicture', and 'coverPicture'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/editprofile'
 * const formData = new FormData();
 * formData.append('username', 'testuser');
 * formData.append('contactInfo', 'New contact info');
 * formData.append('profileName', 'New profile name');
 * formData.append('password', 'newpassword');
 * formData.append('profilePicture', profilePictureFile);
 * formData.append('coverPicture', coverPictureFile);
 *
 * const editProfileResponse = await fetch(`${serverIp}/api/editprofile`, {
 *     method: "POST",
 *     body: formData,
 * });
 *
 * if (editProfileResponse.status === 200) {
 *     console.log("Profile updated successfully");
 * }
 */
router.post('/editprofile', imageUpload, function (req, res) {
  const { username, profileName, email, password } = req.body;
  console.log(req.body);

  const profilePicture = req.files.find(
    (file) => file.fieldname === 'profilePicture'
  );

  const coverPicture = req.files.find(
    (file) => file.fieldname === 'coverPicture'
  );

  const newProfilePicture = profilePicture
    ? `http://blitzbuyr.lol/img/${profilePicture.filename}`
    : null;

  const newCoverPicture = coverPicture
    ? `http://blitzbuyr.lol/img/${coverPicture.filename}`
    : null;

  // Update the Profiles table
  db.run(
    `UPDATE Profiles SET ProfilePicture = COALESCE(?, ProfilePicture), CoverPicture = COALESCE(?, CoverPicture) WHERE Username = ?`,
    [newProfilePicture, newCoverPicture, username],
    function (err) {
      if (err) {
        console.error('Error updating the Profiles table:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Update the Accounts table
      db.run(
        'UPDATE Accounts SET Password = COALESCE(?, Password), Username = COALESCE(?, Username), Email = COALESCE(?, Email) WHERE Username = ?',
        [password, profileName, email, username],
        function (err) {
          if (err) {
            console.error('Error updating the Accounts table:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Respond with success
          res.status(200).json({ message: 'Profile updated successfully' });
        }
      );
    }
  );
});

/** Handles updating a user's contact information.
 *
 * @function
 * @async
 * @name updateContactInfo
 *
 * @param {Object} req - Express.js request object with a JSON body containing 'username' and 'contactInfo'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/editcontactinfo'
 * const requestPayload = {
 *   "username": "testuser",
 *   "contactInfo": {
 *     "phone": {
 *       "data": "123-456-7890",
 *       "hidden": false
 *     },
 *     "email": {
 *       "data": "test@email.com",
 *       "hidden": false
 *     }
 *   }
 * };
 *
 * @throws {Error} If there's an error updating the database.
 */
router.post('/editcontactinfo', async function (req, res) {
  const { username, password, contactInfo } = req.body;
  if (!(await authenticateUser(username, password)))
    return res
      .status(409)
      .json({ error: 'Failed to authenticate with your credentials' });

  // Check if user exists
  const userResult = await new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM Accounts WHERE Username = ?',
      [username],
      (err, rows) => {
        if (err) {
          console.error('Error querying the database (first query):', err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });

  if (!userResult || userResult.length == 0) {
    return res.status(404).json({ error: `User ${username} not found` });
  }

  // Update the contact information and hidden values in the database
  try {
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE ContactInfo SET Phone = ?, Email = ?, LinkedIn = ?, Instagram = ?, Facebook = ?, Twitter = ? WHERE Username = ?`,
        [
          contactInfo.phone.data,
          contactInfo.email.data,
          contactInfo.linkedIn.data,
          contactInfo.instagram.data,
          contactInfo.facebook.data,
          contactInfo.twitter.data,
          username,
        ],
        function (err) {
          if (err) {
            console.error('Error updating contact information:', err);
            reject(err);
          }
          resolve();
        }
      );
    });

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE Settings SET HidePhone = ?, HideEmail = ?, HideLinkedIn = ?, HideInstagram = ?, HideFacebook = ?, HideTwitter = ? WHERE Username = ?`,
        [
          contactInfo.phone.hidden,
          contactInfo.email.hidden,
          contactInfo.linkedIn.hidden,
          contactInfo.instagram.hidden,
          contactInfo.facebook.hidden,
          contactInfo.twitter.hidden,
          username,
        ],
        function (err) {
          if (err) {
            console.error('Error updating hidden values:', err);
            reject(err);
          }
          resolve();
        }
      );
    });

    return res
      .status(200)
      .json({ message: 'Contact information updated successfully' });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
