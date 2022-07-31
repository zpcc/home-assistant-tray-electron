const path = require("path");
const fs = require("fs");

const configPath = path.join(__dirname, "../config.json");
const defaultPath = path.join(__dirname, "../config.default.json");

function readConfig() {
  const filePath = fs.existsSync(configPath) ? configPath : defaultPath;
  const config = fs.readFileSync(filePath);
  return JSON.parse(config);
}

function writeWindowSize(windowHeight, windowWidth) {
  const config = readConfig();
  config.windowHeight = windowHeight;
  config.windowWidth = windowWidth;
  fs.writeFileSync(configPath, JSON.stringify(config));
}

function writeIndexURL(indexURL) {
  const config = readConfig();
  config.indexURL = indexURL;
  fs.writeFileSync(configPath, JSON.stringify(config));
}

module.exports = {
  writeWindowSize,
  writeIndexURL,
  readConfig,
};
