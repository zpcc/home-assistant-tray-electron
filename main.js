const { menubar } = require("menubar");

const { app, Menu, Tray, BrowserWindow } = require("electron");

const path = require("path");
const iconPath = path.join(__dirname, "icon.ico");
const modalPath = path.join("file://", __dirname, "src/config.html");

const { readConfig } = require("./src/common.js");
const config = readConfig();

// ref: https://github.com/maxogden/menubar/blob/master/examples/native-menu/main.js
// ref: https://github.com/electron/electron-api-demos/blob/master/renderer-process/windows/create-window.js

function createWindow() {
  let win = new BrowserWindow({
    width: 400,
    height: 320,
    webPreferences: {
      preload: path.join(__dirname, "src/preload.js"),
    },
  });
  win.loadURL(modalPath);
  win.show();
}

app.on("ready", () => {
  const tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Config",
      click: () => {
        createWindow();
      },
    },
    {
      label: "Exit",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  const height = parseInt(config.windowHeight);
  const width = parseInt(config.windowWidth);
  let indexURL = config.indexURL;
  console.log(`height: ${height}, width: ${width}`);

  if (!indexURL.startsWith("http")) {
    indexURL = path.join("file://", __dirname, "src/index.html");
  }

  const mb = menubar({
    browserWindow: {
      height: height,
      width: width,
      skipTaskbar: true,
    },
    index: indexURL,
    tray,
  });

  mb.on("ready", () => {
    console.log("Menubar app is ready.");
  });
});
