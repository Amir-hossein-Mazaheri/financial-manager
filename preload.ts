const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld("electron", {
  openDialog: (method, config) => ipcRenderer.invoke("dialog", method, config),
  readFile: (path) => ipcRenderer.invoke("readFile", path),
  writeFile: (...args) => ipcRenderer.invoke("writeFile", ...args),
  records: (action, ...args) => ipcRenderer.invoke("records", action, ...args),
  createManyRecords: (records) =>
    ipcRenderer.invoke("createManyRecord", records),
});
