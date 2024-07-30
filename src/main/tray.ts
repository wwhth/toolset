import path, { join } from 'path'
import { Menu, Tray, app, globalShortcut, BrowserWindow, screen, ipcMain } from 'electron'
import { myWindow } from './index'
import { snapshot } from './snapshot'
let cutWindow: BrowserWindow | null = null
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
      accelerator: 'Ctrl+A',
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

        // cutWindow.webContents.send('snapshot', imgUrl)
      }
    }
    // 分割
  ])
  tray.setToolTip('toolset')
  tray.setContextMenu(contextMenu)
  // 注册全局快捷键
  globalShortcut.register('Ctrl+A', () => myWindow.show())
  // globalShortcut.register('ctrl+shift+A', async (): Promise<void> => {
  //   // const imgUrl = await snapshot(myWindow)
  //   // myWindow.webContents.send('snapshot', imgUrl)
  //   ipcMain.handle('snapshot', async () => {
  //     return await snapshot(cutWindow!)
  //   })
  // })
}

function getSize(): { width: number; height: number } {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor
  }
}

async function createCutWindow(): Promise<void> {
  const { width, height } = getSize()
  console.log('🚀 ~ createCutWindow ~ width, height:', width, height)
  cutWindow = new BrowserWindow({
    width,
    height,
    // x: primaryDisplay.workArea.x,
    // y: primaryDisplay.workArea.y,
    // minWidth: 800,
    // minHeight: 600,
    // maxWidth: width,
    // maxHeight: height,
    // title: '截图工具',
    // show: false,
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
  const imgUrl = await snapshot(cutWindow!)
  ipcMain.handle('snapshot', async () => imgUrl)
  cutWindow.on('closed', () => {
    cutWindow = null
    ipcMain.removeHandler('snapshot')
  })
  if (NODE_ENV === 'development') {
    cutWindow.loadURL('http://localhost:5173/#/cut')
  } else {
    cutWindow.loadFile(join(__dirname, '../../out/renderer/index.html'), {
      hash: 'cut'
    })
  }

  cutWindow.maximize()
  cutWindow.setFullScreen(true)
}
app.on('will-quit', () => globalShortcut.unregisterAll())
export default createTray
