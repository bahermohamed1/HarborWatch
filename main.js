const { ipcMain, app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1203,
        height: 1203,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.maximize();
    win.loadFile('inputWindow.html');

    ipcMain.on('finalizedParameters', (event, ships) => {
        win.loadFile('index.html');
    })
}
app.whenReady().then(createWindow);
