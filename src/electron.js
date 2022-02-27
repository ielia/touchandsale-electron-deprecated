const {app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

function createWindow() {
    const applicationWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // noinspection JSIgnoredPromiseFromCall
    applicationWindow.loadURL(isDev ?
        'http://localhost:3000' :
        `file://${path.join(__dirname, '../build/index.html')}`);
    applicationWindow.setMenu(null);
    if (isDev) {
        applicationWindow.webContents.openDevTools({mode: 'detach'});
    }
}

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    // Quit when all windows are closed, except on macOS, where the user has to quit explicitly with Cmd + Q.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(createWindow);
