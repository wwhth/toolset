import path, { join } from 'path'
// import { app } from 'electron'
import { Menu, Tray, app, globalShortcut, BrowserWindow, screen, ipcMain } from 'electron'
import { myWindow } from './index'
import { snapshot } from './snapshot'
let cutWindow: BrowserWindow
const NODE_ENV = process.env.NODE_ENV
const isMac = process.platform === 'darwin'
const createTray = (): void => {
  const tray = new Tray(
    path.resolve(
      __dirname,
      isMac ? '../../resources/trayTemplate@2x.png' : '../../resources/windowTray.png'
    )
  )
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', role: 'quit' },
    {
      label: '打开主界面',
      accelerator: 'Shift+A',
      click: (): void => {
        myWindow.show()
      }
    },
    { type: 'separator' },
    // 配置快捷键shift+A
    {
      label: '截图',
      accelerator: 'ctrl+shift+A',
      click: async (): Promise<void> => {
        createCutWindow()
        const imgUrl = await snapshot(cutWindow)
        console.log('%c Line:33 🍓 imgUrl', 'color:#ea7e5c', imgUrl)
        ipcMain.handle('snapshot', async () => imgUrl)
        // cutWindow.webContents.send('snapshot', imgUrl)
      }
    },
    { label: 'Item3', type: 'radio' }
    // 分割
  ])
  tray.setToolTip('toolset')
  tray.setContextMenu(contextMenu)
  // 注册全局快捷键
  globalShortcut.register('Shift+A', () => myWindow.show())
  globalShortcut.register('ctrl+shift+A', async (): Promise<void> => {
    // const imgUrl = await snapshot(myWindow)
    // myWindow.webContents.send('snapshot', imgUrl)
    ipcMain.handle('snapshot', async () => {
      return await snapshot(cutWindow)
    })
  })
}

function getSize(): { width: number; height: number } {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor
  }
}

function createCutWindow(): void {
  const { width, height } = getSize()
  cutWindow = new BrowserWindow({
    width,
    height,
    autoHideMenuBar: true,
    useContentSize: true,
    movable: false,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    fullscreenable: true,
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    }
  })

  if (NODE_ENV === 'development') {
    cutWindow.loadURL('http://localhost:5173/cut')
  } else {
    cutWindow.loadFile(join(__dirname, '../../dist/index.html'), {
      hash: 'cut'
    })
  }
  // cutWindow.maximize()
  cutWindow.setFullScreen(true)
}
app.on('will-quit', () => globalShortcut.unregisterAll())
export default createTray
