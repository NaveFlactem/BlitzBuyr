/**
 * Sqlite3 database for storing and managing data in a localized and embedded manner within a Node.js App.
 * @module Database
 */

//required modules
const sqlite3 = require("sqlite3").verbose();

/**
 * Initializing database connection.
 *
 * @function
 * @name sqlite3.Database
 *
 * @param {string} filename - This is a required parameter and represents the name of the SQLite database file, including the path if necessary.
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
  PostDate TIMESTAMP,
  FOREIGN KEY (Username) REFERENCES Accounts (Username) ON DELETE CASCADE
  );`;

// Images Table //
const images = `
CREATE TABLE IF NOT EXISTS Images (
  ImageId INTEGER PRIMARY KEY AUTOINCREMENT,
  ListingId INTEGER, 
  ImageURI TEXT,
  BlurHash TEXT,
  FOREIGN KEY (ListingId) REFERENCES Listings (ListingId) ON DELETE CASCADE
);`;

// Rating Table //
const rating = `
CREATE TABLE IF NOT EXISTS Ratings (
  UserRated TEXT, 
  Username TEXT,
  Rating REAL,
  ReviewDescription TEXT,
  PRIMARY KEY (Username, UserRated),
  FOREIGN KEY (UserRated) REFERENCES Users (Username) ON DELETE CASCADE
  );`;

// Profile Table //
const profile = `
CREATE TABLE IF NOT EXISTS Profiles (
  Username TEXT,
  ContactInfo TEXT,
  ProfilePicture TEXT DEFAULT "http://blitzbuyr.lol/img/profile_default.png",
  CoverPicture TEXT DEFAULT "http://blitzbuyr.lol/img/cover_default.jpg",
  PRIMARY KEY (Username)
  );`;

// Likes Table //
const likes = `
CREATE TABLE IF NOT EXISTS Likes (
  Username Text,
  ListingId INTEGER,
  PRIMARY KEY (Username, ListingId),
  FOREIGN KEY (Username) REFERENCES Users (Username) ON DELETE CASCADE,
  FOREIGN KEY (ListingId) REFERENCES Listings (ListingId) ON DELETE CASCADE
  );`;

// Create tables using Promises
const tables = [
  { sql: accountsTable, name: "Accounts" },
  { sql: listingsTable, name: "Listings" },
  { sql: images, name: "Images" },
  { sql: rating, name: "Ratings" },
  { sql: profile, name: "Profiles" },
  { sql: likes, name: "Likes" },
];

/**
 * Initializes tables in the existing database. Does not populate the database.
 *
 * @function
 * @name createTable
 *
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
 *
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
