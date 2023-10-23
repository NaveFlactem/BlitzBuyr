/**
 * Express application for serving static files and handling API requests.
 * @module Server
 */

// Required modules
const express = require("express");
const app = express();
const path = require("path");

// server routes and settings
app
  .use("/api", require("./listing"))
  .use("/api", require("./account"))
  .use("/docs", express.static(path.join(__dirname, "../Docs")));

// Middleware for printing out request information
app.use(function (req, res, next) {
  console.log(`Received request:
    IP: ${req.ip}
    Endpoint: ${req.url}
    Method: ${req.method}
    Query Parameters: ${JSON.stringify(req.query)}
    Request Body: ${JSON.stringify(req.body)}`);
  next();
});

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

// Start the Express server
const server = app.listen(80, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
