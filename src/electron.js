const {app, session, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {promisify} = require('util');
const glob = promisify(require('glob'));

const DEVELOPMENT_EXTENSION_NAMES = ['React Developer Tools'];

async function createWindow() {
    const applicationWindow = new BrowserWindow({
        height: 720,
        webPreferences: {
            nodeIntegration: true,
        },
        width: 1280,
    });

    // noinspection JSIgnoredPromiseFromCall
    await applicationWindow.loadURL(isDev ?
        'http://localhost:3000' :
        `file://${path.join(__dirname, '../build/index.html')}`);
    await applicationWindow.setMenu(null);
    if (isDev) {
        await applicationWindow.webContents.openDevTools({mode: 'detach'});
    }
}

async function loadDevelopmentExtension() {
    const GOOGLE_DATA_DIRS_BY_PLATFORM = {
        darwin: [`${os.homedir()}/Library/Application Support/Google/Chrome`],
        linux: [
            `${os.homedir()}/.config/chromium`,
            `${os.homedir()}/.config/google-chrome`,
            `${os.homedir()}/.config/google-chrome-beta`,
            `${os.homedir()}/.config/google-chrome-canary`,
        ],
        win32: [`${process.env.LOCALAPPDATA}\\Google\\Chrome\\User Data`],
    };
    const foundExtensions = {};
    for (let googleDataDir of GOOGLE_DATA_DIRS_BY_PLATFORM[os.platform()]) {
        const manifestFilenames = await glob(path.join(googleDataDir, '*', 'Extensions', '*', '*', 'manifest.json'));
        try {
            for (let manifestFilename of manifestFilenames) {
                try {
                    const manifestJSON = JSON.parse(fs.readFileSync(manifestFilename));
                    const extensionName = manifestJSON.name;
                    const extIndex = DEVELOPMENT_EXTENSION_NAMES.indexOf(extensionName);
                    if (extIndex >= 0) {
                        const extensionDir = manifestFilename.substring(0, manifestFilename.length - 'manifest.json'.length);
                        console.log(`Loading extension "${extensionName}" at '${extensionDir}'...`);
                        await session.defaultSession.loadExtension(extensionDir);
                        foundExtensions[extensionName] = {dir: extensionDir, version: manifestJSON.version};
                        DEVELOPMENT_EXTENSION_NAMES.splice(extIndex, 1);
                        console.log('Success.');
                        if (!DEVELOPMENT_EXTENSION_NAMES.length) {
                            break;
                        }
                    }
                } catch (exception) {
                    console.error(exception);
                }
                if (!DEVELOPMENT_EXTENSION_NAMES.length) {
                    break;
                }
            }
        } catch {
        }
    }
    console.log('Found the following Development Extensions for Chrome:', foundExtensions);
    if (DEVELOPMENT_EXTENSION_NAMES.length) {
        console.warn('DEVELOPMENT EXTENSIONS NOT FOUND/LOADED:', DEVELOPMENT_EXTENSION_NAMES);
    } else {
        console.log('All Development Extensions were successfully loaded.');
    }
}

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
    }
});

app.on('window-all-closed', () => {
    // Quit when all windows are closed, except on macOS, where the user has to quit explicitly with Cmd + Q.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(async () => {
    if (isDev) {
        await loadDevelopmentExtension();
    }
    await createWindow();
});
