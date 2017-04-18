const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

require('electron-dl')();
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
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'iProfile: ระบบตรวจสอบข้อมูลบน HDC',
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools()
  win.maximize();

  win.on('closed', () => {
    win = null
  })
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
