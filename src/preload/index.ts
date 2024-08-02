import { contextBridge, IpcRenderer, ipcRenderer, nativeImage, clipboard } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const validChannels = ['snapshot', 'close-win', 'saveImgUrl', 'getChartletUrl', 'closeChartlet']
// Custom APIs for renderer
const api = {
  test: (): void => {
    console.log('test')
  },
  ipcHandle2: (): void => {
    ipcRenderer.invoke('ipcHandle2')
  },

  snapshot: (callback): IpcRenderer =>
    ipcRenderer.on('snapshot', (_event, value) => callback(value)),
  invoke: async (channel): Promise<Electron.IpcRenderer | void> => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      console.log('🚀 ~ channel:', channel)
      return await ipcRenderer.invoke(channel)
    }
  },
  send: (channel, ...argus): void => {
    if (validChannels.includes(channel)) {
      console.log('🚀 ~ channel:', channel, argus)
      return ipcRenderer.send(channel, argus)
    }
  },
  cv: (blobUrl): void => {
    fetch(blobUrl)
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        // 使用 FileReader 来读取 Blob 内容
        const reader = new FileReader()
        reader.onload = function (event): void {
          // 读取完成后，event.target.result 包含了 Blob 的内容
          const arrayBuffer = event!.target!.result
          // arrayBuffer转Buffer
          const buffer = Buffer.from(arrayBuffer as ArrayBuffer)
          // 创建 NativeImage
          const image = nativeImage.createFromBuffer(buffer)

          // 将图片放入剪切板
          clipboard.writeImage(image)

          console.log('Image copied to clipboard.')
        }
        reader.readAsArrayBuffer(blob)
      })
      .catch((err) => {
        console.error('Error:', err)
      })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
