const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  organizePhotos: (sourceFolder, outputFolder) =>
    ipcRenderer.invoke('organize-photos', { sourceFolder, outputFolder }),
  getPhotoInfo: (filePath) => ipcRenderer.invoke('get-photo-info', filePath),
  getDirectoryTree: (dirPath) => ipcRenderer.invoke('get-directory-tree', dirPath),
  getDirectoryFiles: (dirPath) => ipcRenderer.invoke('get-directory-files', dirPath),
});