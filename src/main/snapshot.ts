import { desktopCapturer } from 'electron'

// 截图
export async function snapshot() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  console.log('%c Line:6 🍤 sources', 'color:#2eafb0', sources)
  for (const source of sources) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { width: 1280, height: 720 }
        // video: {
        //   mandatory: {
        //     chromeMediaSource: 'desktop',
        //     chromeMediaSourceId: source.id,
        //     minWidth: 1280,
        //     maxWidth: 1280,
        //     minHeight: 720,
        //     maxHeight: 720
        //   }
        // }
      })
      console.log('🚀 ~ snapshot ~ stream:', stream)
    } catch (e) {
      console.log('%c Line:25 🍇', 'color:#93c0a4', e)
    }

    return
  }
}
