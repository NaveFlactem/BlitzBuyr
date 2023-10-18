/**
 * Express application for serving static files and handling API requests.
 * @module Server
 */

// server setup
var express = require("express");
var app = express();
var path = require("path");

// Serve static files from the 'out' directory (JSDocs)
app.use('/docs', express.static(path.join(__dirname, "../docs")));

// Database setup
const { Client } = require("pg");
const client = new Client();

/**
 * Connect to the PostgreSQL database.
 * @function
 * @name connectToDatabase
 * @returns {Promise} - Resolves when the connection is successful, rejects on error.
 */
const connectToDatabase = () => {
  return client
    .connect()
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
};

connectToDatabase();

/**
 * GET request endpoint at the root which will load up the docs homepage
 * @function
 * @name getRoot
 * @param {Request} req - The request that is received.
 * @param {Response} res - The response to return.
 * @throws {500} - Internal Server Error
 */
app.get("/", function (req, res) {
  res.redirect("docs/index.html");
});

/**
 * GET request endpoint at /accounts for retrieving a list of accounts.
 * @function
 * @name getAccounts
 * @param {Request} req - The request that is received.
 * @param {Response} res - The response to return.
 * @returns {JSON} - JSON List of accounts in the database
 * @throws {500} - Internal Server Error
 */
app.get("/accounts", function (req, res) {
  // Query the database for a list of accounts
  client
    .query("SELECT * FROM Accounts")
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.error("Error querying the database:", error);
      res.status(500).send("Internal Server Error");
    });
});

/**
 * Starts the Express server on a specified port and executes a callback function.
 * @function
 * @name startServer
 * @param {number} port - The port at which the server will listen on.
 * @param {function} callback - The callback function called on server start.
 */
var server = app.listen(80, async function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
