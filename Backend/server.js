/**
 * Express application for serving static files and handling API requests.
 * @module Server
 */

// Required modules
const express = require("express");
const app = express();
const path = require("path");
const db = require("./db").db;
const validator = require("validator");
const apiRouter = express.Router();
app.use("/api", apiRouter);

// Middleware for parsing JSON request bodies
var bodyParser = require("body-parser");
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));

// Middleware for printing out request information
apiRouter.use(function (req, res, next) {
  console.log(`Received request:
    IP: ${req.ip}
    Endpoint: ${req.url}
    Method: ${req.method}
    Query Parameters: ${JSON.stringify(req.query)}
    Request Body: ${JSON.stringify(req.body)}`);
  next();
});

// Serve static files from the docs directory
app.use("/docs", express.static(path.join(__dirname, "../Docs")));

/**
 * GET request endpoint at the root which will redirect to the docs homepage.
 * @function
 * @name getRoot
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
app.get("/", function (req, res) {
  // Redirect to the docs homepage
  res.redirect("docs/index.html");
});

// #region Account Management API functions

/**
 * GET request endpoint at /api/accounts for retrieving a list of accounts.
 * @function
 * @name getAccounts
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
apiRouter.get("/accounts", function (req, res) {
  // Query the database for a list of accounts
  db.all("SELECT * FROM Accounts", (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Respond with a JSON array of accounts
    return res.status(200).json({ Accounts: rows });
  });
});

/**
 * Handles login requests and performs authentication.
 * @name handleLoginRequest
 * @function
 * @param {Object} req - Express.js request object with a JSON body containing 'username' and 'password'.
 * @param {Object} res - Express.js response object.
 * @example
 * // Sample HTTP POST request to '/api/login'
 * // Request body should contain a JSON object with 'username' and 'password' fields.
 * // If authentication is successful, it will respond with a success message.
 * // If authentication fails (username not found or incorrect password), it will respond with an error message.
 */
apiRouter.post("/login", function (req, res) {
  console.log(req.body);
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM Accounts WHERE Username = ?",
    [username],
    (err, row) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!row) {
        return res.status(401).json({ error: "Username not found" }); // 401 = Unauthorized
      }

      if (password === row.password) {
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    }
  );
});

/**
 * Handles user registration requests and account creation.
 * @name handleRegistrationRequest
 * @function
 * @param {Object} req - Express.js request object with a JSON body containing 'username', 'password', 'confirmPassword', and 'email'.
 * @param {Object} res - Express.js response object.
 * @example
 * // Sample HTTP POST request to '/api/register'
 * // Request body should contain a JSON object with 'username', 'password', 'confirmPassword', and 'email' fields.
 * // If the username is available, it will create a new account and respond with a success message.
 * // If the username is already taken, it will respond with a 409 Conflict status code.
 */
apiRouter.post("/register", function (req, res) {
  console.log(req.body);
  const { username, password, confirmPassword, email } = req.body;

  // Check if password and confirmPassword match
  if (confirmPassword != password) {
    return res
      .status(400)
      .json({ error: "Password and confirm password are not equal" });
  }

  // Validate an email address
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  db.get(
    "SELECT Username FROM Accounts WHERE Username = ? OR Email = ?",
    [username, email],
    (err, row) => {
      if (err) {
        console.error("Error checking username availability:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (row) {
        return res
          .status(409)
          .json({
            error: `${
              row.username == username ? "Username" : "Email"
            } already exists`,
          }); // 409 = Conflict
      } else {
        // WIP: Consider hashing and/or salting the password for security.
        db.run(
          "INSERT INTO Accounts (Username, Password, Email) VALUES (?, ?, ?)",
          [username, password, email],
          (err) => {
            if (err) {
              console.error("Error registering the account:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            // WIP: Consider adding constraints to the password (such as checking that it's strong enough with length, characters, etc.).
            return res.status(201).json({
              message: "Account created",
              username: username,
            });
          }
        );
      }
    }
  );
});

// #endregion

// #region Listings Management API functions

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
apiRouter.post("/createListing", function (req, res) {
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
          "INSERT INTO Images (imageId, listingId, imageData) VALUES (?, ?)",
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
apiRouter.get("/listings", function (req, res) {
  db.all("SELECT * FROM Listings", (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json({ Listings: rows });
  });
});

// #endregion

// Start the Express server
const server = app.listen(80, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
