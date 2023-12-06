![BlitzBuyr Logo](https://i.imgur.com/EHeXa9f.png)

## Table of Contents

- [Introduction](#introduction)
- [Showcase](#showcase)
- [Installation](#installation)
- [Contributing](#contributing)
- [Guides](#guides)
  - [Generating/Updating Docs](#generatingupdating-docs)
  - [Unit Testing](#unit-testing)
- [Deliverables](#deliverables)
- [Team](#team)
- [Conclusion](#conclusion)

## Introduction

BlitzBuyr is a mobile app designed to revolutionize the online shopping experience by offering users a personalized and interactive platform. With BlitzBuyr, users can discover unique products, compare prices, and connect with a community of like-minded shoppers, creating a vibrant space for individuality and engagement. BlitzBuyr is driven by the need for a more interactive and personalized online shopping experience, aligning with the preferences of users who value short-term, engaging interactions on popular social media platforms. By addressing this gap, we aim to redefine the online marketplace landscape and provide a unique space that highlights the individuality of each product. Beyond this, we aim to create a thriving community where users can connect, share experiences, and build relationships around their shared interests and purchases.

## Showcase

Here's a showcase some of the features and user interface of BlitzBuyr:
| ![Home Screen](https://i.imgur.com/m5oda0w.jpeg) | ![Listing Description](https://i.imgur.com/ixuNI5O.png) | ![Profile Page](https://i.imgur.com/JTrY3GK.png) |
| ------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| ![Profile Page 2](https://i.imgur.com/KGWWFUV.png) | ![Profile Page 3](https://i.imgur.com/XAkpKKA.png) | ![Filters](https://i.imgur.com/qqDqE8F.png) |
| ![Settings](https://i.imgur.com/kFG6AZF.png) | ![Contact Info Dark Mode](https://i.imgur.com/zUfEE10.png) | ![Home Screen Dark Mode](https://i.imgur.com/azQ7J91.jpeg) |
| ![Create Listing Dark Mode](https://i.imgur.com/ej3Ei95.png) | |

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
- [Design Documents](<https://www.figma.com/file/MwLj7dRBdARcD1attEeKtE/Diagramming-101-(Community)-(Copy)?type=whiteboard&node-id=0-1&t=in6RSGhQpJVO2J82-0>)

## Team

BlitzBuyrDevs (BBD)

- Product Owner: [Evan Metcalf](https://github.com/NaveFlactem)
- Developers: [Lukas Teixeira Döpcke](https://github.com/Iuke121), [Alfonso Del Rosario](https://github.com/addelros), [Thomas Pollicino](https://github.com/ThomasPollicino), [Shreyas Vittal](https://github.com/svittalucsc)

## Conclusion

If you have any new or undocumented issues or bugs, submit them in [Issues](https://github.com/NaveFlactem/BlitzBuyr/issues)!
