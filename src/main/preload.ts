import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  newScene: (callback: () => void) => ipcRenderer.on('new-scene', callback),
  addCube: (callback: () => void) => ipcRenderer.on('add-cube', callback),
  loadScene: (callback: (event: Electron.IpcRendererEvent, data: string) => void) =>
    ipcRenderer.on('load-scene', callback),
  requestSaveScene: (callback: () => void) => 
    ipcRenderer.on('request-save-scene', callback),
  saveScene: (sceneData: string) => ipcRenderer.send('save-scene', sceneData),
  onSaveSceneComplete: (callback: (event: Electron.IpcRendererEvent, filePath: string) => void) =>
    ipcRenderer.on('save-scene-complete', callback),
  onSaveSceneError: (callback: (event: Electron.IpcRendererEvent, error: string) => void) =>
    ipcRenderer.on('save-scene-error', callback),
});