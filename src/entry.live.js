const { app, BrowserWindow, ipcMain } = require('electron');
require('electron-dl')();

const path = require('path')
const url = require('url')

const {download} = require('electron-dl');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

ipcMain.on('close-app', (event, arg) => {
  event.returnValue = null
  app.quit();
});

ipcMain.on('download-file', (event, args) => {
  const options = {
    saveAs: true,
    openFolderWhenDone: true
  }
	download(BrowserWindow.getFocusedWindow(), args.url, options)
    .then(dl => {
      console.log(dl.getSavePath());
      let result = { ok: true, path: dl.getSavePath() };
      event.sender.send('downloaded', result);
    })
		.catch((err) => event.sender.send('downloaded', {ok: false, message: err}));
});

function createWindow () {
  setTimeout(() => {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'iProfile: ระบบตรวจสอบข้อมูลบน HDC'
    });

    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }));

    win.maximize();    
    // win.webContents.openDevTools()

    win.on('closed', () => {
      win = null
    })
  }, 12000)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
