import path, { join } from 'path'
import { Menu, Tray, app, globalShortcut, BrowserWindow, screen, ipcMain } from 'electron'
import { myWindow } from './index'
import { snapshot } from './snapshot'
import Store from 'electron-store'
// 数组怎么用store保存
// const schema = {
//   imgUrlList: {
//     type: 'array',
//     default: []
//   }
// }
interface imageData {
  url: string
  width: number
  height: number
}
const store = new Store()
let offset: number = 0
const imgUrlList: imageData[] = []
let cutWindow: BrowserWindow | null = null
let chartletWindow: BrowserWindow | null = null
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
        if (cutWindow != null) {
          cutWindow?.destroy()
          cutWindow = null
        }
        createCutWindow()
      }
    },
    {
      label: '贴图',
      accelerator: 'ctrl+S',
      click: (): void => {
        if ((store.get('imgUrlList') as imageData[]).length > 0) {
          createChartletWindow()
        }
      }
    }
    // 分割
  ])
  tray.setToolTip('toolset')
  tray.setContextMenu(contextMenu)
  // 注册全局快捷键
  globalShortcut.register('Ctrl+A', () => myWindow.show())
  globalShortcut.register('ctrl+shift+A', async (): Promise<void> => {
    if (cutWindow != null) {
      cutWindow?.destroy()
      cutWindow = null
    }
    createCutWindow()
  })
  globalShortcut.register('ctrl+S', async (): Promise<void> => {
    if ((store.get('imgUrlList') as imageData[])?.length > 0) {
      createChartletWindow()
    }
  })
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
  // 获取所有显示屏
  const mouse = screen.getCursorScreenPoint()

  const primaryDisplay = screen.getDisplayNearestPoint(mouse)
  console.log('primaryDisplay: ---------------------', primaryDisplay)

  cutWindow = new BrowserWindow({
    width,
    height,
    x: primaryDisplay.bounds.x,
    y: primaryDisplay.bounds.y,
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
      webSecurity: false
    }
  })
  const imgUrl = await snapshot(cutWindow!)
  ipcMain.handle('snapshot', async () => imgUrl)
  cutWindow.on('closed', () => {
    ipcMain.removeHandler('snapshot')
  })
  cutWindow.on('hide', () => {
    ipcMain.removeHandler('snapshot')
  })
  if (NODE_ENV === 'development') {
    cutWindow.loadURL('http://localhost:5173/#/cut')
  } else {
    cutWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'cut'
    })
  }
  cutWindow.maximize()
  cutWindow.setFullScreen(true)
}

async function createChartletWindow(): Promise<void> {
  ipcMain.removeHandler('getChartletUrl')
  if (chartletWindow != null) {
    offset += 10
  }
  chartletWindow = new BrowserWindow({
    width: ((store.get('imgUrlList') as imageData[])[0].width as number) + 20,
    height: ((store.get('imgUrlList') as imageData[])[0].height as number) + 20,
    // minWidth: 800,
    // minHeight: 600,
    maxWidth: 800,
    maxHeight: 600,
    x: 100 + offset,
    y: 100 + offset,
    // title: '截图工具',
    // show: false,
    autoHideMenuBar: true,
    // useContentSize: true,
    movable: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false
      // webSecurity: false
    }
  })
  const imgUrl = store.get('imgUrlList')![0].url as number
  ipcMain.handle('getChartletUrl', () => imgUrl)
  chartletWindow.on('closed', () => {
    chartletWindow = null
    ipcMain.removeHandler('getChartletUrl')
  })
  if (NODE_ENV === 'development') {
    chartletWindow.loadURL('http://localhost:5173/#/chartlet')
  } else {
    chartletWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'chartlet'
    })
  }
}
ipcMain.on('close-win', () => {
  // cutWindow?.removeAllListeners('close')
  // cutWindow?.removeAllListeners('beforeunload')
  // cutWindow?.isDestroyed() || cutWindow?.close()
  closeCutWindow()
})
ipcMain.on('saveImgUrl', (_event, data: [string, { width: number; height: number }]) => {
  console.log('%c Line:113 🍿 imgUrl', 'color:#ea7e5c', data)
  // store.delete('imgUrlList')
  const options = {
    url: data[0],
    width: data[1].width,
    height: data[1].height
  }
  imgUrlList.unshift(options)
  store.set('imgUrlList', imgUrlList)
  console.log('%c Line:131 🥖 store', 'color:#4fff4B', store.get('imgUrlList'))
  closeCutWindow()
})
ipcMain.on('closeChartlet', () => {
  let currentWin = BrowserWindow.getFocusedWindow()
  currentWin?.destroy()
  currentWin = null
})
app.on('will-quit', () => globalShortcut.unregisterAll())
app.on('quit', () => {
  console.log('%c Line:209 🍫', 'color:#6ec1c2')
  if (store.get('imgUrlList')) {
    store.delete('imgUrlList')
  }
  chartletWindow?.destroy()
  cutWindow?.destroy()
  chartletWindow = null
  cutWindow = null
})
app.on('will-quit', () => {
  console.log('%c Line:215 🌮', 'color:#2eafb0')
  if (store.get('imgUrlList')) {
    store.delete('imgUrlList')
  }
  chartletWindow?.destroy()
  cutWindow?.destroy()
  chartletWindow = null
  cutWindow = null
})
app.on('before-quit', () => {
  console.log('%c Line:232 🎂', 'color:#f5ce50')
  chartletWindow?.destroy()
  cutWindow?.destroy()
  chartletWindow = null
  cutWindow = null
})
function closeCutWindow(): void {
  cutWindow?.hide()
  // cutWindow = null
}
export default createTray
