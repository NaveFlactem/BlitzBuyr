# <img src="http://blitzbuyr.lol/img/blitzbuyr_name_logo.png" alt="BlitzBuyr Logo" width="300">

# BlitzBuyr Documentation

## Table of Contents

- [Backend](#backend)
  - [Server](#server)
  - [Account Management](#account-management)
  - [Listing Management](#listing-management)
- [Frontend](#frontend)
  - [CreateAccountScreen](#createaccountscreen)
  - [Login Screen](#login-screen)
  - [HomeScreen](#homescreen)
  - [ProfileScreen](#profilescreen)

## Backend

The backend of BlitzBuyr is built using Node.js and Express, with SQLite3 as the database. It serves as the core of the application, handling API requests and managing user accounts and listings.

### Server

The server handles routing and middleware, providing the foundation for API endpoints. Key components include:

- Conglomerating the different routes into express.
- Request logging middleware.
- Static routes for our JSDoc documentation.
- Starting the Express server.

[View `server.js` source code](Backend_server.js.html)

### Account Management

BlitzBuyr's account management system allows users to register, login, and authenticate their accounts. Key components include:

- GET request endpoint for retrieving a list of accounts.
- POST request endpoint for user registration.
- POST request endpoint for user login and authentication.

[View `account.js` source code](Backend_account.js.html)

### Listing Management

Listings are a fundamental part of BlitzBuyr, and the backend provides endpoints for listing creation and retrieval. Key components include:

- POST request endpoint for creating a new listing.
- GET request endpoint for retrieving a list of all listings.

[View `listing.js` source code](Backend_listing.js.html)

## Frontend

The frontend of BlitzBuyr is built using React Native and provides a user-friendly interface for interacting with the application. It includes various screens for creating accounts, logging in, browsing listings, and managing user profiles.

### CreateAccountScreen

The Create Account screen allows users to create a new account, providing essential account information such as username, password, email, etc.

[View `CreateAccountScreen.js` source code](Frontend_CreateAccountScreen.js.html)

### Login Screen

The Login screen enables users to log into their accounts, requiring username and password authentication.

[View `LoginScreen.js` source code](Frontend_LoginScreen.js.html)

### HomeScreen

The Home screen is the primary user interface for browsing listings, interacting with listings, and discovering new items for sale.

[View `HomeScreen.js` source code](Frontend_HomeScreen.js.html)

### ProfileScreen

The Profile screen allows users to manage their profiles, view their listings, and interact with other users.

Each of these screens plays a vital role in delivering a seamless user experience within the BlitzBuyr application.

[View `ProfileScreen.js` source code](Frontend_ProfileScreen.js.html)

## Conclusion

This documentation serves as a reference for developers working on the BlitzBuyr project, as well as any interested in our workflow or codebase, outlining the structure and key components of both the backend and frontend.
