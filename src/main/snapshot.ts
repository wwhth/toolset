import { BrowserWindow, desktopCapturer, screen } from 'electron'

// 截图
export async function snapshot(win: BrowserWindow): Promise<string> {
  const current_screen = getCurrentScreen(win) // 取得当前屏幕

  const mouse = screen.getCursorScreenPoint()

  const primaryDisplay = screen.getDisplayNearestPoint(mouse)
  // 这里的 primaryDisplay.size 由于缩放的原因可能与系统设置的分辨率不一样, 再乘上缩放比 scaleFactor
  const reality_width = primaryDisplay.size.width * primaryDisplay.scaleFactor
  const reality_height = primaryDisplay.size.height * primaryDisplay.scaleFactor
  const thumbSize = { width: reality_width, height: reality_height }
  const source = (await getDesktopCapturer(
    current_screen,
    thumbSize
  )) as Electron.DesktopCapturerSource // 取得当前屏幕截屏数据

  const imgUrl = source.thumbnail.toDataURL()
  return imgUrl
}

// // 获取当前窗口所在屏幕
function getCurrentScreen(win: BrowserWindow): { screen_index: number } {
  const currentBounds = win.getBounds()

  const currentDisplay = screen.getDisplayNearestPoint({ x: currentBounds.x, y: currentBounds.y })

  const allDisplays = screen.getAllDisplays()

  const currentDisplayIndex = allDisplays.findIndex((display) => {
    return display.id === currentDisplay.id
  })
  return { screen_index: currentDisplayIndex }
}
async function getDesktopCapturer(
  current_screen,
  thumbSize
): Promise<Electron.DesktopCapturerSource | void> {
  const screenName = current_screen['screen_index'] + 1
  const screen_names: string[] = []
  screen_names.push('屏幕 ' + screenName) // 中文为 `screen_names.push('屏幕 ' + screenName);`
  screen_names.push('Entire Screen') // 中文为 `screen_names.push('整个屏幕');`

  // 以 thumbSize 屏幕分辨率取得所有屏幕截屏数据，如果 types 设置为 ['screen'， 'window'] 同时可以获取各个窗口的截屏数据
  const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: thumbSize })

  // 如果只有一个屏幕，则 name 为'整个屏幕'，如果有两个及以上屏幕，则 name 为 '屏幕 1' 和 '屏幕 2'
  if (sources) {
    for (const source of sources) {
      if (screen_names.indexOf(source.name) != -1) {
        // 通过 name 确定屏幕
        return source
      }
    }
  }
  // const source = sources.filter((e: any) => e.id == 'screen:0:0')[0]
  // return source
}
