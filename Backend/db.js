const client = require('./server'); //testing importing/exporting in js (file to file)


const sqlite3 = require('sqlite3').verbose();

//opens connection to SQLite database (for now the file will be accessed/created in the same folder for testing)
//also don't know best practices for db maintenance (i.e. where to put all the data)
const db = new sqlite3.Database('./my_database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});


///////////////////////// ------------SAMPLE QUERY CALLS------------ /////////////////////////////

// db.run('CREATE TABLE IF NOT EXISTS my_table (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)');

// db.run('INSERT INTO my_table (name, age) VALUES (?, ?)', ['John', 30], (err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Data inserted successfully.');
//   }
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//NOTES: 
//I was reading about how db queries should not be run async, and should instead be ran with promises
//Each query should finish before the next one starts

//Example:

// function createTable() {
//   return new Promise((resolve, reject) => {
//     db.run('CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY, name TEXT)', (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve();
//       }
//     });
//   });
// }

// function insertData(name) {
//   return new Promise((resolve, reject) => {
//     db.run('INSERT INTO mytable (name) VALUES (?)', [name], (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve();
//       }
//     });
//   });
// }

// async function main() {
//   try {
//     await createTable();
//     await insertData('John');
//     await insertData('Alice');
//     await insertData('Bob');
//   } catch (error) {
//     console.error(error);
//   } finally {
//     db.close();
//   }
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Closes the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database connection closed.');
  }
});

// const path = require('path');

// // Specify the path to your SQLite database file
// const dbPath = path.resolve(__dirname, 'mydatabase.db');

// // Create a new SQLite database connection
// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) {
//     console.error('Error opening database:', err.message);
//   } else {
//     console.log('Connected to the database');
//   }
// });



// // Define a function to close the database connection when needed
// function closeDatabase() {
//   db.close((err) => {
//     if (err) {
//       console.error('Error closing database:', err.message);
//     } else {
//       console.log('Database connection closed');
//     }
//   });
// }

// module.exports = {
//   db,
//   closeDatabase,
// };
