/**
 * Express application for serving static files and handling API requests.
 * @module Server
 */

// Server setup
const express = require("express");
const bodyParser = require("body-parser"); // You might need this later
const app = express();
app.use(express.json());
const path = require("path");
const db = require("./db");

// Serve static files from the docs directory
app.use("/docs", express.static(path.join(__dirname, "../docs")));

/** GET request endpoint at the root which will load up the docs homepage
 * @function
 * @name getRoot
 * @param {Object} req - Received express.js request object.
 * @param {Object} res - To be sent back express.js response object.
 */
app.get("/", function (req, res) {
  res.redirect("docs/index.html");
});

// #region Account Management API functions

/** GET request endpoint at /accounts for retrieving a list of accounts.
 * @function
 * @name getAccounts
 * @param {Object} req - Received express.js request object.
 * @param {Object} res - To be sent back express.js response object.
 */
app.get("/accounts", function (req, res) {
  // Query the database for a list of accounts
  db.all("SELECT * FROM Accounts", (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(200).json({ Accounts: rows });
  });
});

/** Handles login requests and performs authentication
 * @name handleLoginRequest
 * @function
 * @param {Object} req - Received express.js request object.
 * @param {Object} res - To be sent back express.js response object.
 * @example
 * // Sample HTTP POST request to '/login'
 * // Request body should contain a JSON object with 'username' and 'password' fields.
 * // If authentication is successful, it will respond with a success message.
 * // If authentication fails (username not found or incorrect password), it will respond with an error message.
 */
app.post("/login", function (req, res) {
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

/** Handle user registration requests and account creation.
 * @name handleRegistrationRequest
 * @function
 * @param {Object} req - Received express.js request object.
 * @param {Object} res - To be sent back express.js response object.
 * @example
 * // Sample HTTP POST request to '/register'
 * // Request body should contain a JSON object with 'username', 'password', 'confirmPassword', and 'email' fields.
 * // If the username is available, it will create a new account and respond with a success message.
 * // If the username is already taken, it will respond with a 409 Conflict status code.
 */
app.post("/register", function (req, res) {
  const { username, password, confirmPassword, email } = req.body;
  // WIP DO THE CONFIRM PASSWORD CHECK (if they are equal)
  if (confirmPassword !== password)
    return res
      .status(400)
      .json({ error: "Password and confirm password are not equal" });

  db.get(
    "SELECT Username FROM Accounts WHERE Username = ?",
    [username],
    (err, row) => {
      if (err) {
        console.error("Error checking username availability:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (row) {
        return res.status(409).json({ error: "Username already exists" }); // 409 = Conflict
      } else {
        // WIP: Consider hashing and/or salting the password for security.
        db.run(
          "INSERT INTO Accounts (Username, Password) VALUES (?, ?)",
          [username, password],
          (err) => {
            if (err) {
              console.error("Error registering the account:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            // WIP: Consider adding constraints to the password (such as checking that it's strong enough with length, characters, etc.)
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
/** Starts the Express server on a specified port and executes a callback function.
 * @function
 * @name startServer
 * @param {number} port - The port at which the server will listen on.
 * @param {function} callback - The callback function called on server start.
 */
const server = app.listen(80, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
