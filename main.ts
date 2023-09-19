const { join } = require("path");
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { readFile, writeFile } = require("fs/promises");
const { PrismaClient } = require("./src/database");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.IS_DEV === "true";

const prisma = new PrismaClient();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, "preload.ts"),
      nodeIntegration: true,
      devTools: isDev,
    },
  });

  mainWindow.menuBarVisible = false;

  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5173/");
  } else {
    mainWindow.loadFile(join(__dirname, "build", "index.html"));
  }
}

async function readJson(path) {
  const content = await readFile(path);

  return Buffer.from(content).toString("utf-8");
}

app
  .whenReady()
  .then(() => {
    return prisma.$connect();
  })
  .then(() => {
    createWindow();

    ipcMain.handle("dialog", (event, method, params) => dialog[method](params));

    ipcMain.handle("readFile", (event, path) => readJson(path));

    ipcMain.handle("records", (event, action, ...args) =>
      prisma.record[action](...args)
    );

    ipcMain.handle("createManyRecord", (event, records) =>
      prisma.$transaction(async (tx) => {
        for (const record of records) {
          await tx.record.create({
            data: record,
          });
        }
      })
    );

    ipcMain.handle("writeFile", (event, ...args) => writeFile(...args));

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch(console.log);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
