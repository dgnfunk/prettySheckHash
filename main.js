// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { ipcMain } = require('electron')

if(require('electron-squirrel-startup')) return;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 430,
    height: 380,
    maxHeight: 380,
    minHeight: 380,
    maxWidth: 430,
    minWidth: 430,
    frame: false,
    icon: path.join(app.getAppPath(), 'src/assets/psheck1.1.1.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  ipcMain.on('close-window', (event, arg) => {
    if (arg === 'true') {
      mainWindow.close();
    }
  })

  ipcMain.on('minimize-window', (event, arg) => {
    if (arg === 'true') {
      mainWindow.minimize();
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algunas APIs pueden solamente ser usadas despues de que este evento ocurra.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Tu también puedes ponerlos en archivos separados y requerirlos aquí.