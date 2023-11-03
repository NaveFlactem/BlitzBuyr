/**
 * Express application for serving static files and handling API requests.
 * @module API
 */

const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
const db = require("./db").db;
const validator = require("validator");

/**
 * GET request endpoint at /api/accounts for retrieving a list of accounts.
 *
 * @function
 * @name getAccounts
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP GET request to '/api/accounts'
 * const accountsResponse = await fetch(`${serverIp}/api/accounts`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (accountsResponse.status === 200) {
 *     const accountsData = await accountsResponse.json();
 *     console.log("List of Accounts:", accountsData.Accounts);
 * }
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
 *
 * @function
 * @name handleLoginRequest
 *
 * @param {Object} req - Express.js request object with a JSON body containing 'username' and 'password'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/login'
 * const loginData = {
 *     username: "testuser",
 *     password: "password123",
 *   };
 * const loginResponse = await fetch(`${serverIp}/api/login`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify(loginData),
 *   });
 *
 * if (loginResponse.status === 200) {
 *     console.log("Login successful");
 * } else if (loginResponse.status === 401) {
 *     console.log("Authentication failed");
 * }
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
 *
 * @function
 * @name handleRegistrationRequest
 *
 * @param {Object} req - Express.js request object with a JSON body containing 'username', 'password', 'confirmPassword', and 'email'.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP POST request to '/api/register'
 * const registrationData = {
 *     username: "newuser",
 *     password: "password123",
 *     confirmPassword: "password123",
 *     email: "newuser@example.com",
 *   };
 * const registrationResponse = await fetch(`${serverIp}/api/register`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify(registrationData),
 *   });
 *
 * if (registrationResponse.status === 201) {
 *     console.log("Account created");
 * } else if (registrationResponse.status === 409) {
 *     console.log("Username or email already exists");
 * }
 */
router.post("/register", (req, res) => {
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
            row.Username == username ? "Username" : "Email"
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

/**
 * Handles deleting of accounts.
 *
 * @function
 * @name handleDeleteAccounts
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 *
 * @example
 * // Sample HTTP DELETE request to '/api/deleteaccounts?username=testuser'
 * // Delete a specific user account by providing the 'username' query parameter.
 * // If successful, it will respond with a success message.
 * // If the username doesn't exist, it will respond with an error message.
 * const deleteResponse = await fetch(`${serverIp}/api/deleteaccounts?username=testuser`, {
 *     method: "DELETE",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 * if (deleteResponse.status === 200) {
 *     console.log("Account deleted successfully");
 * } else if (deleteResponse.status === 500) {
 *     console.log("Error deleting account");
 * }
 */
router.delete("/deleteaccounts", function (req, res) {
  const username = req.query.username;

  if (username) {
    db.run("DELETE FROM Accounts WHERE Username = ?", [username], (err) => {
      if (err) {
        console.error(`Error deleting account ${username}:`, err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: `${username} account deleted` });
    });
  } else {
    db.run("DELETE FROM Accounts", (err) => {
      if (err) {
        console.error("Error deleting all accounts:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: "All accounts deleted" });
    });
  }
});

// Export the router
module.exports = router;
