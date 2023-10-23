const client = require("./server"); //testing importing/exporting in js (file to file)

const sqlite3 = require("sqlite3").verbose();

//opens connection to SQLite database (for now the file will be accessed/created in the same folder for testing)
//also don't know best practices for db maintenance (i.e. where to put all the data)
const db = new sqlite3.Database("./Backend/blitzbuyr.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

// Database Setup calls
db.run(`CREATE TABLE IF NOT EXISTS Accounts (
  Username TEXT PRIMARY KEY, 
  Password TEXT NOT NULL, 
  Email TEXT NOT NULL)`);

db.run(`CREATE TABLE IF NOT EXISTS Listings (
  ListingId INTEGER PRIMARY KEY AUTOINCREMENT,
  Price REAL NOT NULL,
  Title TEXT NOT NULL,
  Username TEXT NOT NULL,
  Description TEXT, 
  PostDate TIMESTAMP NOT NULL)`);

module.exports = {
  db,
};
