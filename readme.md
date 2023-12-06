![BlitzBuyr Logo](https://i.imgur.com/EHeXa9f.png)

## Introduction

BlitzBuyr is a mobile app designed to revolutionize the online shopping experience by offering users a personalized and interactive platform. With BlitzBuyr, users can discover unique products, compare prices, and connect with a community of like-minded shoppers, creating a vibrant space for individuality and engagement. BlitzBuyr is driven by the need for a more interactive and personalized online shopping experience, aligning with the preferences of users who value short-term, engaging interactions on popular social media platforms. By addressing this gap, we aim to redefine the online marketplace landscape and provide a unique space that highlights the individuality of each product. Beyond this, we aim to create a thriving community where users can connect, share experiences, and build relationships around their shared interests and purchases.

## Showcase

Here's a showcase some of the features and user interface of BlitzBuyr:

<!DOCTYPE html>
<html lang="en">
<head>
  <title>BlitzBuyr Showcase Carousel</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <style>
    .carousel-inner img {
      width: 50%;
      height: auto;
      margin: auto;
    }
    #myCarousel {
      width: 50%;
      float: left;
    }
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
  </style>
</head>
<body>
<div class="container">
  <div id="myCarousel" class="carousel slide" data-ride="carousel">
    <!-- Indicators -->
    <ol class="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
      <li data-target="#myCarousel" data-slide-to="3"></li>
      <li data-target="#myCarousel" data-slide-to="4"></li>
      <li data-target="#myCarousel" data-slide-to="5"></li>
      <li data-target="#myCarousel" data-slide-to="6"></li>
      <li data-target="#myCarousel" data-slide-to="7"></li>
      <li data-target="#myCarousel" data-slide-to="8"></li>
      <li data-target="#myCarousel" data-slide-to="9"></li>
      <li data-target="#myCarousel" data-slide-to="10"></li>
    </ol>
    <!-- Wrapper for slides -->
    <div class="carousel-inner">
      <div class="item active">
        <img src="https://i.imgur.com/m5oda0w.jpeg" alt="Home Screen">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/ixuNI5O.png" alt="Listing Description">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/JTrY3GK.png" alt="Profile Page">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/KGWWFUV.png" alt="Profile Page 2">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/XAkpKKA.png" alt="Profile Page 3">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/qqDqE8F.png" alt="Filters">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/kFG6AZF.png" alt="Settings">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/zUfEE10.png" alt="Contact Info Dark Mode">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/azQ7J91.jpeg" alt="Home Screen Dark Mode">
      </div>
      <div class="item">
        <img src="https://i.imgur.com/ej3Ei95.png" alt="Create Listing Dark Mode">
      </div>
    </div>
    <!-- Left and right controls -->
    <a class="left carousel-control" href="#myCarousel" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#myCarousel" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</div>
</body>
</html>

## Table of Contents

- [Installation](#installation)
- [Contributing](#contributing)
- [Guides](#guides)
  - [Generating/Updating Docs](#generatingupdating-docs)
  - [Unit Testing](#unit-testing)
- [Deliverables](#deliverables)
- [Team](#team)
- [Conclusion](#conclusion)

## Installation

### Requirements:

- [Node.js](https://nodejs.org/en/download)
- [Expo Go app](https://expo.dev/client)

### Steps:

1. Clone the git repository to your local machine.
2. Install the required dependencies by navigating to the project root folder and running the following command:
   `npm install`
   Note: If you are on a Mac/Linux system, you may need to use `sudo` before the command.
3. Switch to the backend server's folder from the root server by running the following command:
   `cd ./Backend`
4. Install the backend server's dependencies and start the server by running the following commands:
   `npm install`
   `node server.js`
5. Open a new terminal at the project root folder and navigate to the React Native app folder by running the following command:
   `cd ./Frontend`
6. Start the React Native app by running the following command:
   `npm start`
7. On your Expo Go app on your phone, scan the QR code displayed in the terminal to open the app.
8. Use the app as intended.

## Contributing

If you want to contribute to the project, follow these steps:

1. Make a fork of the repository for your feature or changes.
2. Create a new branch for your changes.
3. Make the necessary changes and commit them to your branch.
4. Push your branch to your forked repository.
5. Submit a pull request to the main branch of the original repository.

## Guides

### Generating/Updating Docs

To generate or update the documentation, follow these steps:

1. Make sure you have `jsdoc` installed globally by running the following command:
   `npm install -g jsdoc`
2. Fully delete the `Docs` folder in the project. This is to generate a fresh documentation folder.
3. At the base project folder (blitzbuyr), run the following command:
   `jsdoc -c jsdoc.json`
   This will generate the documentation based on the JSDoc comments in the code.

To check the generated documentation, simply type `localhost` in your browser, which will take you to the documentation landing page.

Feel free check the [JSDoc main page](https://jsdoc.app) for more reference and guides on how to use JSDoc.

### Unit Testing

Unit testing is done with Mocha and Chai for the backend, and Jest for the frontend. Check their respective test folders in the Backend and Frontend directories. Refer to [Frontend Unit Tests](https://github.com/NaveFlactem/BlitzBuyr/tree/Testing-Branch/Frontend/tests) and [Backend Unit Tests](https://github.com/NaveFlactem/BlitzBuyr/tree/Testing-Branch/Backend/test) for reference on the existing tests and how to write additional tests.

## Deliverables

- [Presentation PowerPoint](https://docs.google.com/presentation/d/1Sqmb-mlpkXzaFk18pKedMxlt58aA9RclxXbM5NzQPVo/edit#slide=id.p)
- [Scrum Documents Folder](https://drive.google.com/drive/u/0/folders/1uojHzauiQEiMA0Tz0TicCllIFZs5BGL-)
- [Test Plan and Report Document](https://docs.google.com/document/d/1421OKnpSpiZaO3-3GJeWJ5KHAnAvv0nNFfs30BBLBzc/edit#heading=h.2yy5cnnmsswp)
- [Release Summary Document](https://docs.google.com/document/d/1WjgArigd5WFmqFfMzPfhd7Xs9remaX6HwLvQZ41PWoU/edit#heading=h.1tzgsuwnhc5v)
- [Known Issues and Bugs](https://docs.google.com/document/d/1WjgArigd5WFmqFfMzPfhd7Xs9remaX6HwLvQZ41PWoU/edit#heading=h.6e8vzf4atd4x)
- [Design Documents](TBD)

## Team

BlitzBuyrDevs (BBD)

- Product Owner: [Evan Metcalf](https://github.com/NaveFlactem)
- Developers: [Lukas Teixeira Döpcke](https://github.com/Iuke121), [Alfonso Del Rosario](https://github.com/addelros), [Thomas Pollicino](https://github.com/ThomasPollicino), [Shreyas Vittal](https://github.com/svittalucsc)

## Conclusion

If you have any new or undocumented issues or bugs, submit them in [Issues](https://github.com/NaveFlactem/BlitzBuyr/issues)!
