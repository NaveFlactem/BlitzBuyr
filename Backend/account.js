/**
 * @module API
 */

const express = require('express');
const router = express.Router();
const db = require('./db').db;
const validator = require("validator");

/**
 * GET request endpoint at /api/accounts for retrieving a list of accounts.
 * @function
 * @name getAccounts
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 */
router.get("/accounts", function (req, res) {
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
router.post("/login", function (req, res) {
  const { username, password } = req.body;

  db.get(
    "SELECT Username, Password FROM Accounts WHERE Username = ?",
    [username],
    (err, row) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!row) {
        return res.status(401).json({ error: "Username not found" }); // 401 = Unauthorized
      }

      if (password === row.Password) {
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
router.post("/register", function (req, res) {
  const { username, password, confirmPassword, email } = req.body;

  // Check if password and confirmPassword match
  if (confirmPassword !== password) {
    return res
      .status(400)
      .json({ error: "Password and confirm password are not equal" });
  }

  // Validate an email address
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email is not valid" });
  }

  db.get(
    "SELECT Username, Email FROM Accounts WHERE Username = ? OR Email = ?",
    [username, email],
    (err, row) => {
      if (err) {
        console.error("Error checking username availability:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (row) {
        return res.status(409).json({
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

// Export the router
module.exports = router;
