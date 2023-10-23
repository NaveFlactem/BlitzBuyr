const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./blitzbuyr.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Accounts Table //
const accountsTable = `
  CREATE TABLE IF NOT EXISTS Accounts (
  Username TEXT PRIMARY KEY,
  Password TEXT,
  Email INTEGER
  );`;

db.run(accountsTable, function (err) {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created successfully.');
  }
});

const listingsTable = `
CREATE TABLE IF NOT EXISTS Listings (
  ListingID INTEGER PRIMARY KEY AUTOINCREMENT,
  Lrice REAL,
  Title TEXT,
  Description TEXT,
  PostDate TIMESTAMP
  );`;

db.run(listingsTable, function (err) {
  if (err) {
    console.error('Error creating table: ', err.message);
  } else {
    console.log('Table created successfully');
  }
});

const images = `
CREATE TABLE IF NOT EXISTS Images (
  ImageID INTEGER PRIMARY KEY AUTOINCREMENT,
  ListingID INTEGER, 
  Imagedata BLOB
  );`;

db.run(images, function (err) {
  if (err) {
    console.error('Error creating table: ', err.message);
  } else {
    console.log('Table created successfully');
  }
});

const rating = `
CREATE TABLE IF NOT EXISTS Ratings (
  UserRatedID INTEGER, 
  UserID INTEGER,
  Rating INTEGER,
  ReviewDescription VARCHAR(255)
  );`;

db.run(rating, function (err) {
  if (err) {
    console.error('Error creating table: ', err.message);
  } else {
    console.log('Table created successfully');
  }
});

const profile = `
CREATE TABLE IF NOT EXISTS Profile (
  Username VARCHAR(50), 
  ContactInfo VARCHAR(200),
  ListingIDs VARCHAR(255),
  ReviewDescription VARCHAR(255)
  );`;

db.run(profile, function (err) {
  if (err) {
    console.error('Error creating table: ', err.message);
  } else {
    console.log('Table created successfully');
  }
});

const likes = `
CREATE TABLE IF NOT EXISTS Likes (
  UserID VARCHAR(255),
  ItemID VARCHAR(255)
  );`;

db.run(likes, function (err) {
  if (err) {
    console.error('Error creating table: ', err.message);
  } else {
    console.log('Table created successfully');
  }
});


// Closes the database connection //
db.close((err) => {
  if (err) {
  } else {
    console.log('Database connection closed.');
  }
});

module.exports = {
  db,
};
