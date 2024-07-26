import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import createTray from './tray'
export let myWindow = null as unknown as BrowserWindow
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'darwin' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  myWindow = mainWindow
  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  // })
  // mainWindow.on('close', (e) => {
  //   console.log('%c Line:26 🥑', 'color:#42b983')
  //   const choice = dialog.showMessageBoxSync(mainWindow, {
  //     type: 'info',
  //     buttons: ['最小化到托盘', '直接退出'],
  //     title: '提示',
  //     message: '确定要关闭吗?',
  //     defaultId: 0,
  //     cancelId: 1
  //   })
  //   const leave = choice === 0
  //   if (leave) {
  //     e.preventDefault()
  //     // mainWindow.minimize()
  //     mainWindow.hide()
  //   }
  // })
  // mainWindow.on('closed', () => {
  //   console.log('%c Line:29 🥛', 'color:#3f7cff')
  //   app.quit()
  // })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // dock中隐藏
  app.dock.hide()
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('ipcHandle2', () => {
    console.log('%c Line:77 🥑', 'color:#6ec1c2')
    return 123
  })
  createWindow()
  // 托盘
  createTray()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
