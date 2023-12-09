const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../Frontend/assets');
const outputFilePath = path.join(__dirname, '../Frontend/constants/AssetFileNames.js');

fs.readdir(assetsDir, (err, files) => {
    if (err) {
        console.error('Error reading assets directory:', err);
        return;
    }

    const requires = files.map(file => `require('../assets/${file}')`);
    const fileContent = `export const assetsToPreload = [\n  ${requires.join(',\n  ')}\n];\n`;


    fs.writeFile(outputFilePath, fileContent, (err) => {
        if (err) {
            console.error('Error writing assetFilenames.js:', err);
        } else {
            console.log('AssetFilenames.js generated successfully.');
        }
    });
});
