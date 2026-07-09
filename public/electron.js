const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('select-output-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('organize-photos', async (event, args) => {
  try {
    const { sourceFolder, outputFolder } = args;
    const photoOrganizer = require('./photo-organizer');
    const result = await photoOrganizer.organizePhotos(sourceFolder, outputFolder);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-photo-info', async (event, filePath) => {
  try {
    const photoOrganizer = require('./photo-organizer');
    const info = await photoOrganizer.getPhotoInfo(filePath);
    return { success: true, data: info };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-directory-tree', async (event, dirPath) => {
  try {
    const photoOrganizer = require('./photo-organizer');
    const tree = await photoOrganizer.getDirectoryTree(dirPath);
    return { success: true, data: tree };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-directory-files', async (event, dirPath) => {
  try {
    const photoOrganizer = require('./photo-organizer');
    const files = await photoOrganizer.getDirectoryFiles(dirPath);
    return { success: true, data: files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});