const { contextBridge } = require("electron");
const { readConfig, writeWindowSize, writeIndexURL } = require("./common.js");

// ref: https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation

contextBridge.exposeInMainWorld("myAPI", {
  readConfig: () => readConfig(),
  writeWindowSize: (windowHeight, windowWidth) =>
    writeWindowSize(windowHeight, windowWidth),
  writeIndexURL: (indexURL) => writeIndexURL(indexURL),
});
