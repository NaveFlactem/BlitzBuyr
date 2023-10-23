const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./my_database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Accounts Table //
const accountsTable = `
  CREATE TABLE IF NOT EXISTS Accounts (
  username TEXT PRIMARY KEY,
  password TEXT,
  emailAddress INTEGER
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
  listingID INTEGER PRIMARY KEY,
  price NUMERIC(10,2),
  title TEXT,
  description TEXT,
  postDate DATE
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
  listingID INTEGER PRIMARY KEY, 
  imageID INTEGER,
  image DATA BLOB
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
  userRatedID INTEGER, 
  userID INTEGER,
  rating INTEGER,
  reviewDescription VARCHAR(255)
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
  username VARCHAR(50), 
  contactInfo VARCHAR(200),
  listingIDs VARCHAR(255),
  reviewDescription VARCHAR(255)
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
  userID VARCHAR(255),
  itemID VARCHAR(255)
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

