const { app, Tray, Menu, BrowserWindow, globalShortcut, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let win = null;

app.isQuiting = false;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    show: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Use a preload script
    }
  });

  win.loadURL('https://chat.mistral.ai/chat');

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'icons', 'AppIcon-20@2x.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: () => win.show() },
    { label: 'Quit', click: () => { app.isQuiting = true; app.quit(); } }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('LeChat Desktop App');

  tray.on('click', () => win.isVisible() ? win.hide() : win.show());
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  const image = nativeImage.createFromPath('icons/icon-512.png');
  app.dock.setIcon(image);

  globalShortcut.register('Command+Q', () => {
    app.isQuiting = true;
    app.quit();
  });

  app.on('before-quit', () => {
    app.isQuiting = true;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
