const { contextBridge, ipcRenderer } = require("electron");

// ref: https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation
// ref: https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload

contextBridge.exposeInMainWorld("myAPI", {
  readConfig: () => ipcRenderer.invoke("read-config"),
  writeWindowSize: (windowHeight, windowWidth) =>
    ipcRenderer.invoke("write-window-size", { windowHeight, windowWidth }),
  writeIndexURL: (indexURL) => ipcRenderer.invoke("write-index-url", { indexURL }),
});
