import { BrowserWindow, desktopCapturer, screen } from 'electron'

// 截图
export async function snapshot(win: BrowserWindow): Promise<string> {
  const current_screen = getCurrentScreen(win) // 取得当前屏幕
  console.log('current_screen: ', current_screen)

  const mouse = screen.getCursorScreenPoint()
  console.log('🚀 ~ snapshot ~ mouse:', mouse)

  const primaryDisplay = screen.getDisplayNearestPoint(mouse)
  console.log('🚀 ~ snapshot ~ primaryDisplay:', primaryDisplay)
  // 这里的 primaryDisplay.size 由于缩放的原因可能与系统设置的分辨率不一样, 再乘上缩放比 scaleFactor
  const reality_width = primaryDisplay.size.width * primaryDisplay.scaleFactor
  const reality_height = primaryDisplay.size.height * primaryDisplay.scaleFactor
  const thumbSize = { width: reality_width, height: reality_height }
  const source = (await getDesktopCapturer(
    current_screen,
    thumbSize
  )) as Electron.DesktopCapturerSource // 取得当前屏幕截屏数据
  console.log(source, '=======')
  const imgUrl = source.thumbnail.toDataURL()
  return imgUrl
}

// 获取当前窗口所在屏幕
function getCurrentScreen(win: BrowserWindow): { screen_index: number; currentDisplayId: number } {
  const currentBounds = win.getBounds()

  const currentDisplay = screen.getDisplayNearestPoint({ x: currentBounds.x, y: currentBounds.y })
  console.log('currentDisplay: ', currentDisplay)

  const allDisplays = screen.getAllDisplays()
  console.log('allDisplays: ', allDisplays)
  const currentDisplayIndex = allDisplays.findIndex((display) => {
    return display.id === currentDisplay.id
  })
  const currentDisplayId = allDisplays[currentDisplayIndex].id
  console.log('currentDisplayId: ', currentDisplayId)
  console.log('currentDisplayIndex: ', currentDisplayIndex)
  return { screen_index: currentDisplayIndex, currentDisplayId: currentDisplayId }
}
async function getDesktopCapturer(
  current_screen,
  thumbSize
): Promise<Electron.DesktopCapturerSource | void> {
  const screenName = current_screen['screen_index'] + 1
  console.log('🚀 ~ current_screen:', current_screen)
  console.log('🚀 ~ screenName:', screenName)
  const screen_names: string[] = []
  screen_names.push('屏幕 ' + screenName) // 中文为 `screen_names.push('屏幕 ' + screenName);` 英文 screen_names.push('Screen ' + screenName)
  screen_names.push('整个屏幕') // 中文为 `screen_names.push('整个屏幕');` 英文 screen_names.push('Entire Screen')
  console.log('🚀 ~ screen_names:', screen_names)
  // 以 thumbSize 屏幕分辨率取得所有屏幕截屏数据，如果 types 设置为 ['screen'， 'window'] 同时可以获取各个窗口的截屏数据
  const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: thumbSize })
  console.log('🚀 ~ sources:', sources)

  // 如果只有一个屏幕，则 name 为'整个屏幕'，如果有两个及以上屏幕，则 name 为 '屏幕 1' 和 '屏幕 2'
  if (sources) {
    for (const source of sources) {
      // macOS 系统下，如果屏幕分辨率不同，则 name 为 '屏幕 1' 和 '屏幕 2'，所以不能通过 name 确定屏幕
      if (process.platform === 'darwin') {
        if (current_screen['currentDisplayId'] == source.display_id) {
          // display_id 确定屏幕更好一些
          return source
        }
      } else if (process.platform === 'win32') {
        if (screen_names.indexOf(source.name) != -1) {
          // 通过 name 确定屏幕  mac接入ipad作为镜像顺序会跟上面不一致
          return source
        }
      } else {
        alert('请使用macOS或Windows系统')
      }
    }
  }
  // const source = sources.filter((e: any) => e.id == 'screen:0:0')[0]
  // return source
}
