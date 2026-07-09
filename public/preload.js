const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  organizePhotos: (sourceFolder) =>
    ipcRenderer.invoke('organize-photos', { sourceFolder }),
  getPhotoInfo: (filePath) => ipcRenderer.invoke('get-photo-info', filePath),
});
