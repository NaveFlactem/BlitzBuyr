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

function extractColumnsFromDefinition(definition) {
  const matchResult = definition.match(/\(([\s\S]+)\)/);
  return matchResult
    ? matchResult[1].replace(/\s+/g, " ").toLowerCase().trim()
    : "";
}

function areTableDefinitionsEqual(definition1, definition2) {
  // Extract and compare the normalized column definitions
  const columns1 = extractColumnsFromDefinition(definition1);
  const columns2 = extractColumnsFromDefinition(definition2);

  //console.log(columns1, columns2);
  return columns1 === columns2;
}

function createOrUpdateTable(db, tableDefinition) {
  db.serialize(() => {
    // Extract table name from the definition
    const tableName = tableDefinition.match(
      /CREATE TABLE IF NOT EXISTS (\w+)/i
    )[1];

    // Check if the table already exists
    db.get(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`,
      (err, existingTable) => {
        if (err) {
          console.error(err.message);
          return;
        }

        if (!existingTable) {
          // If the table doesn't exist, create it
          db.run(tableDefinition);
          console.log(`Table '${tableName}' created successfully.`);
        } else {
          // If the table exists, compare the column definitions
          const existingTableDefinition = existingTable.sql;

          if (
            areTableDefinitionsEqual(existingTableDefinition, tableDefinition)
          ) {
            console.log(
              `Table '${tableName}' structure is already up to date.`
            );
          } else {
            // If the table structures are different, alter it
            const tempTableName = `${tableName}_Temp`;

            // Create a temporary table with the new structure
            db.run(
              tableDefinition.replace(
                new RegExp(tableName, "g"),
                tempTableName
              ),
              (err) => {
                if (err) {
                  console.error(err.message);
                  return;
                }

                // Copy data from the existing table to the temporary table
                db.run(
                  `INSERT INTO ${tempTableName} SELECT * FROM ${tableName}`,
                  (err) => {
                    if (err) {
                      console.error(err.message);
                      return;
                    }

                    // Drop the existing table
                    db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
                      if (err) {
                        console.error(err.message);
                        return;
                      }

                      // Rename the temporary table to the original table name
                      db.run(
                        `ALTER TABLE ${tempTableName} RENAME TO ${tableName}`,
                        (err) => {
                          if (err) {
                            console.error(err.message);
                            return;
                          }

                          console.log(
                            `Table '${tableName}' altered successfully.`
                          );
                        }
                      );
                    });
                  }
                );
              }
            );
          }
        }
      }
    );
  });
}

// Accounts Table //
const accountsTable = `
CREATE TABLE IF NOT EXISTS Accounts (
  Username TEXT PRIMARY KEY,
  Password TEXT,
  Email TEXT
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
  Latitude REAL,
  Longitude REAL,
  City TEXT,
  FOREIGN KEY (Username) REFERENCES Accounts (Username) ON DELETE CASCADE ON UPDATE CASCADE
  );`;

const tagDetails = `
CREATE TABLE IF NOT EXISTS Tags (
  TagId INTEGER PRIMARY KEY AUTOINCREMENT,
  TagName TEXT UNIQUE
);`;

const tagTable = `
CREATE TABLE IF NOT EXISTS ListingTags (
  ListingId INTEGER,
  TagId INTEGER,
  TagName TEXT,
  PRIMARY KEY (ListingId, TagId),
  FOREIGN KEY (ListingId) REFERENCES Listings (ListingId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (TagId) REFERENCES Tags (TagId) ON DELETE CASCADE ON UPDATE CASCADE
);`;

// Images Table //
const images = `
CREATE TABLE IF NOT EXISTS Images (
  ImageId INTEGER PRIMARY KEY AUTOINCREMENT,
  ListingId INTEGER, 
  ImageURI TEXT,
  BlurHash TEXT,
  FOREIGN KEY (ListingId) REFERENCES Listings (ListingId) ON DELETE CASCADE ON UPDATE CASCADE
);`;

// Rating Table //
const rating = `
CREATE TABLE IF NOT EXISTS Ratings (
  UserRated TEXT, 
  Username TEXT,
  Rating REAL,
  ReviewDescription TEXT,
  PRIMARY KEY (Username, UserRated),
  FOREIGN KEY (UserRated) REFERENCES Accounts (Username) ON DELETE CASCADE ON UPDATE CASCADE
  );`;

// Profile Table //
const profile = `
CREATE TABLE IF NOT EXISTS Profiles (
  Username TEXT,
  ProfilePicture TEXT DEFAULT "http://blitzbuyr.lol/img/profile_default.png",
  CoverPicture TEXT DEFAULT "http://blitzbuyr.lol/img/cover_default.jpg",
  PRIMARY KEY (Username),
  FOREIGN KEY (Username) REFERENCES Accounts (Username) ON DELETE CASCADE ON UPDATE CASCADE
  );`;

// Contact Info Table
const contactInfo = `
CREATE TABLE IF NOT EXISTS ContactInfo (
  Username TEXT,
  Phone TEXT,
  Email TEXT,
  LinkedIn TEXT,
  Instagram TEXT,
  Facebook TEXT,
  Twitter TEXT,
  PRIMARY KEY (Username),
  FOREIGN KEY (Username) REFERENCES Accounts (Username) ON DELETE CASCADE ON UPDATE CASCADE
);`;

// Settings
const settings = `
CREATE TABLE IF NOT EXISTS Settings (
  Username TEXT,
  HidePhone BOOLEAN DEFAULT True,
  HideEmail BOOLEAN DEFAULT True,
  HideLinkedIn BOOLEAN DEFAULT True,
  HideInstagram BOOLEAN DEFAULT True,
  HideFacebook BOOLEAN DEFAULT True,
  HideTwitter BOOLEAN DEFAULT True,
  PRIMARY KEY (Username),
  FOREIGN KEY (Username) REFERENCES Accounts (Username) ON DELETE CASCADE ON UPDATE CASCADE
);`;

// Likes Table //
const likes = `
CREATE TABLE IF NOT EXISTS Likes (
  Username Text,
  ListingId INTEGER,
  PRIMARY KEY (Username, ListingId),
  FOREIGN KEY (Username) REFERENCES Accounts (Username) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ListingId) REFERENCES Listings (ListingId) ON DELETE CASCADE ON UPDATE CASCADE
  );`;

// Create tables using Promises
const tables = [
  { sql: accountsTable, name: "Accounts" },
  { sql: listingsTable, name: "Listings" },
  { sql: images, name: "Images" },
  { sql: rating, name: "Ratings" },
  { sql: profile, name: "Profiles" },
  { sql: likes, name: "Likes" },
  { sql: tagTable, name: "TagTable" },
  { sql: tagDetails, name: "TagDetails" },
  { sql: contactInfo, name: "ContactInfo" },
  { sql: settings, name: "Settings" },
];

/**
 * Loops through globally initialized list that holds all SQL create statements.
 *
 * @function
 * @name createTables
 */
async function createTables() {
  try {
    for (const table of tables) {
      createOrUpdateTable(db, table.sql);
    }
    db.run("PRAGMA foreign_keys=ON");
  } catch (err) {
    console.log("error:", err);
  }
}

createTables();

module.exports = {
  db,
};
