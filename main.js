const { menubar } = require("menubar");

const { app, Menu, Tray, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const iconPath = path.join(__dirname, "icon.ico");
const modalPath = path.join("file://", __dirname, "src/config.html");

const { readConfig, writeWindowSize, writeIndexURL } = require("./src/common.js");
const config = readConfig();

// ref: https://github.com/maxogden/menubar/blob/master/examples/native-menu/main.js
// ref: https://github.com/electron/electron-api-demos/blob/master/renderer-process/windows/create-window.js
// ref: https://github.com/reZach/secure-electron-template/blob/master/docs/newtoelectron.md
// ref: https://www.electronjs.org/zh/docs/latest/tutorial/ipc

ipcMain.handle("read-config", () => {
  return readConfig();
});

ipcMain.handle("write-window-size", (event, { windowHeight, windowWidth }) => {
  writeWindowSize(windowHeight, windowWidth);
  return true;
});

ipcMain.handle("write-index-url", (event, { indexURL }) => {
  writeIndexURL(indexURL);
  return true;
});

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
      label: "Restart",
      click: () => {
        app.relaunch()
        app.exit()
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
