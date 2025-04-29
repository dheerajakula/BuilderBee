import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Determine if we are in development mode
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app.
  if (isDev) {
    // Load from the dev server
    mainWindow.loadURL('http://localhost:9000');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // Load the production build
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html')); 
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Scene',
          click: () => {
            mainWindow?.webContents.send('new-scene');
          }
        },
        {
          label: 'Open Scene',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              filters: [{ name: 'Scene Files', extensions: ['json'] }],
              properties: ['openFile']
            });
            
            if (!canceled && filePaths.length > 0) {
              try {
                const data = fs.readFileSync(filePaths[0], 'utf8');
                mainWindow?.webContents.send('load-scene', data);
              } catch (err) {
                console.error('Failed to read file:', err);
              }
            }
          }
        },
        {
          label: 'Save Scene',
          click: async () => {
            mainWindow?.webContents.send('request-save-scene');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'GameObjects',
      submenu: [
        {
          label: 'Add Cube',
          click: () => {
            mainWindow?.webContents.send('add-cube');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow?.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle save dialogue
ipcMain.on('save-scene', async (event, sceneData) => {
  if (!mainWindow) return;

  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'Scene Files', extensions: ['json'] }],
    properties: ['showOverwriteConfirmation']
  });

  if (!canceled && filePath) {
    try {
      fs.writeFileSync(filePath, sceneData);
      event.reply('save-scene-complete', filePath);
    } catch (err) {
      console.error('Failed to save file:', err);
      event.reply('save-scene-error', String(err));
    }
  }
});