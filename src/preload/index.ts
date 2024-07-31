import { contextBridge, IpcRenderer, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const validChannels = ['snapshot', 'close-win']
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
  send: (channel): void => {
    if (validChannels.includes(channel)) {
      console.log('🚀 ~ channel:', channel)
      return ipcRenderer.send(channel)
    }
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
