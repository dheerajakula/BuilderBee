/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);



let mainWindow = null;
// Determine if we are in development mode
const isDev = !electron__WEBPACK_IMPORTED_MODULE_0__.app.isPackaged;
function createWindow() {
    mainWindow = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, 'preload.js')
        }
    });
    // Load the index.html of the app.
    if (isDev) {
        // Load from the dev server
        mainWindow.loadURL('http://localhost:9000');
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }
    else {
        // Load the production build
        mainWindow.loadFile(path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, '../renderer/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    createMenu();
}
function createMenu() {
    const template = [
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
                        const { canceled, filePaths } = await electron__WEBPACK_IMPORTED_MODULE_0__.dialog.showOpenDialog({
                            filters: [{ name: 'Scene Files', extensions: ['json'] }],
                            properties: ['openFile']
                        });
                        if (!canceled && filePaths.length > 0) {
                            try {
                                const data = fs__WEBPACK_IMPORTED_MODULE_2__.readFileSync(filePaths[0], 'utf8');
                                mainWindow?.webContents.send('load-scene', data);
                            }
                            catch (err) {
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
                        electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();
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
    const menu = electron__WEBPACK_IMPORTED_MODULE_0__.Menu.buildFromTemplate(template);
    electron__WEBPACK_IMPORTED_MODULE_0__.Menu.setApplicationMenu(menu);
}
electron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady().then(() => {
    createWindow();
    electron__WEBPACK_IMPORTED_MODULE_0__.app.on('activate', () => {
        if (electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron__WEBPACK_IMPORTED_MODULE_0__.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();
    }
});
// Handle save dialogue
electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.on('save-scene', async (event, sceneData) => {
    if (!mainWindow)
        return;
    const { canceled, filePath } = await electron__WEBPACK_IMPORTED_MODULE_0__.dialog.showSaveDialog({
        filters: [{ name: 'Scene Files', extensions: ['json'] }],
        properties: ['showOverwriteConfirmation']
    });
    if (!canceled && filePath) {
        try {
            fs__WEBPACK_IMPORTED_MODULE_2__.writeFileSync(filePath, sceneData);
            event.reply('save-scene-complete', filePath);
        }
        catch (err) {
            console.error('Failed to save file:', err);
            event.reply('save-scene-error', String(err));
        }
    }
});

})();

/******/ })()
;
//# sourceMappingURL=main.js.map