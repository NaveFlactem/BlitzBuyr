const sqlite3 = require("sqlite3").verbose();

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
  Description TEXT,
  PostDate TIMESTAMP
  );`;
  
// Images Table //
const images = `
CREATE TABLE IF NOT EXISTS Images (
  ImageId INTEGER PRIMARY KEY AUTOINCREMENT,
  ListingId INTEGER, 
  Imagedata BLOB
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
  { sql: accountsTable, name: 'Accounts' },
  { sql: listingsTable, name: 'Listings' },
  { sql: images, name: 'Images' },
  { sql: rating, name: 'Ratings' },
  { sql: profile, name: 'Profile' },
  { sql: likes, name: 'Likes' }
];

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

