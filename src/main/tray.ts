import path from 'path'
// import { app } from 'electron'
import { Menu, Tray, app, globalShortcut } from 'electron'
import { myWindow } from './index'
import { snapshot } from './snapshot'
const isMac = process.platform === 'darwin'
const createTray = (): void => {
  const tray = new Tray(
    path.resolve(
      __dirname,
      isMac ? '../../resources/trayTemplate@2x.png' : '../../resources/windowTray.png'
    )
  )
  const contextMenu = Menu.buildFromTemplate([
    // { label: '退出', role: 'quit' },
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
        const imgUrl = await snapshot(myWindow)
        myWindow.webContents.send('snapshot', imgUrl)
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
    const imgUrl = await snapshot(myWindow)
    myWindow.webContents.send('snapshot', imgUrl)
  })
}

app.on('will-quit', () => globalShortcut.unregisterAll())
export default createTray
