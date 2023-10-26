//required modules
const sqlite3 = require("sqlite3").verbose();

/**
 * Sqlite3 database for storing and managing data in a localized and embedded manner within a Node.js App.
 * @module Database
 */

/**
 * Initializing database connection.
 * @function
 * @name sqlite3.Database
 * @param {string} filename -  This is a required parameter and represents the name of the SQLite database file, including the path if necessary.
 * @param {function} callback - This is a callback function that will be executed once the connection to the database is established.
 */
const db = new sqlite3.Database("./blitzbuyr.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

// Accounts Table //
const accountsTable = `
CREATE TABLE IF NOT EXISTS Accounts (
  Username TEXT PRIMARY KEY,
  Password TEXT,
  Email INTEGER
  );`;

// Listings Table //
const listingsTable = `
  CREATE TABLE IF NOT EXISTS Listings (
    ListingId INTEGER PRIMARY KEY AUTOINCREMENT,
    Price REAL,
    Title TEXT,
    Username TEXT,
    Description TEXT,
    PostDate TIMESTAMP
  );`;

// Images Table //
const images = `
CREATE TABLE IF NOT EXISTS Images (
  ImageId INTEGER PRIMARY KEY AUTOINCREMENT,
  ListingId INTEGER, 
  ImageURI TEXT
  );`;

// Rating Table //
const rating = `
CREATE TABLE IF NOT EXISTS Ratings (
  UserRatedId INTEGER, 
  UserId INTEGER,
  Rating INTEGER,
  ReviewDescription VARCHAR(255)
  );`;

// Profile Table //
const profile = `
CREATE TABLE IF NOT EXISTS Profile (
  Username VARCHAR(50), 
  ContactInfo VARCHAR(200),
  ListingId VARCHAR(255),
  ReviewDescription VARCHAR(255)
  );`;

// Likes Table //
const likes = `
CREATE TABLE IF NOT EXISTS Likes (
  UserId VARCHAR(255),
  ItemId VARCHAR(255)
  );`;

// Create tables using Promises
const tables = [
  { sql: accountsTable, name: "Accounts" },
  { sql: listingsTable, name: "Listings" },
  { sql: images, name: "Images" },
  { sql: rating, name: "Ratings" },
  { sql: profile, name: "Profile" },
  { sql: likes, name: "Likes" },
];

/**
 * Initializes tables in the existing database. Does not populate the database.
 * @function
 * @name createTable
 * @param {String} sql - SQL create statement that's run using the initialized SQlite db object.
 * @param {String} tableName - Holds the name of the table being created
 */
// Function to create tables
function createTable(sql, tableName) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        console.error(`Error creating table ${tableName}:`, err.message);
        reject(err);
      } else {
        console.log(`Table ${tableName} created successfully.`);
        resolve();
      }
    });
  });
}

/**
 * Loops through globally initialized list that holds all SQL create statements.
 * @function
 * @name createTables
 */
async function createTables() {
  try {
    for (const table of tables) {
      await createTable(table.sql, table.name);
    }
  } catch (err) {} //error already logged
}

createTables();

module.exports = {
  db,
};
