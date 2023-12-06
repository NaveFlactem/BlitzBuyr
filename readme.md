# BlitzBuyr Documentation

Welcome to the official documentation for BlitzBuyr (BBC - BlitzBuyr Coders). This document provides an overview of the project's structure, key components, and how to use them effectively.

<!-- 
## Table of Contents

- [Backend](#backend)
  - [Server](#server)
  - [Account Management](#account-management)
  - [Listing Management](#listing-management)
- [Frontend](#frontend)
  - [CreateAccountScreen](#createaccountscreen)
  - [Login Screen](#login-screen)
  - [HomeScreen](#homescreen)
  - [ProfileScreen](#profilescreen) -->

## Backend

The backend of BlitzBuyr is built using Node.js and Express, with SQLite3 as the database. It serves as the core of the application, handling API requests and managing user accounts and listings.

### Server

The server handles routing and middleware, providing the foundation for API endpoints. Key components include:

- Conglomerating the different routes into express.
- Request logging middleware.
- Static routes for our JSDoc documentation.
- Starting the Express server.

[View `server.js` source code](server.js.html)

### Account Management

BlitzBuyr's account management system allows users to register, login, and authenticate their accounts. Key components include:

- GET request endpoint for retrieving a list of accounts.
- POST request endpoint for user registration. Requires username, password and email. Returns success/failure message.
- POST request endpoint for user login and authentication. Requires username and password. Returns success/failure message and authentication token on success.

[View `account.js` source code](account.js.html)

### Listing Management

Listings are a fundamental part of BlitzBuyr, and the backend provides endpoints for listing creation and retrieval. Key components include:

- POST request endpoint for creating a new listing. Requires listing details and returns the created listing ID.
- GET request endpoint for retrieving a list of all listings. Returns a list of all listings.

[View `listing.js` source code](listing.js.html)

## Frontend

The frontend of BlitzBuyr is built using React Native and provides a user-friendly interface for interacting with the application. It includes various screens for creating accounts, logging in, browsing listings, and managing user profiles.

### CreateAccountScreen

The Create Account screen allows users to create a new account, providing essential account information such as username, password, email, etc.

[View `CreateAccountScreen.js` source code](CreateAccountScreen.js.html)

### Login Screen

The Login screen enables users to log into their accounts, requiring username and password authentication. On successful login, proceeds to HomeScreen.

[View `LoginScreen.js` source code](LoginScreen.js.html)

### HomeScreen

The Home screen is the primary user interface for browsing listings, interacting with listings, and discovering new items for sale. Requires authentication to access.

[View `HomeScreen.js` source code](HomeScreen.js.html)

### ProfileScreen

The Profile screen allows users to manage their profiles, view their listings, and interact with other users. Requires authentication to access own profile.

Each of these screens plays a vital role in delivering a seamless user experience within the BlitzBuyr application.

[View `ProfileScreen.js` source code](ProfileScreen.js.html)

### CreateListing

The Create Listing Screen allows users to create and upolad a listing.  The user inputs a title,
descriptions, price, currency type, transaction preference, condition, and tags.  Then the user is able
to upload images of the item they are trying to sell.

[View `CreateListing.js` source code](CreateListing.js.html)

### RatingScreen

The Rating Screen allows users to rate another users out of 5.  The user selects a star rating to give
to another profile that they compelted a transaction through.  

[View `RatingScreen.js` source code](RatingScreen.js.html)

### SettingsScreen

The Settings Screen allows users to change their password, input contact info, toggle notifications,
toggle dark mode and read our about us section.

[View `SettingsScreen.js` source code](SettingsScreen.js.html)

### EditProfileScreen

The Edit Profile Screen allows users to edit their username, email, profile photo and banner photo. It
also allows users to delete their account.  

[View `EditProfileScreen.js` source code](EditProfileScreen.js.html)

## Conclusion

This documentation serves as a reference for developers working on the BlitzBuyr project, as well as any interested in our workflow or codebase, outlining the structure and key components of both the backend and frontend.
