import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import CropDemo from './components/Cropper'
import { useState } from 'react'
function App(): JSX.Element {
  const [src, setSrc] = useState('')
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  window.api.snapshot((val) => {
    console.log('%c Line:9 🍐 val', 'color:#fca650', val)
    setSrc(val)
  })
  const handle2 = async (): Promise<void> => {
    const aaa = await window.api.ipcHandle2()
    console.log('%c Line:9 🍐 aaa', 'color:#fca650', aaa)
  }
  window.api.test()
  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC 单向
          </a>
          <a target="_blank" rel="noreferrer" onClick={handle2}>
            Send IPC 双向
          </a>
        </div>
      </div>
      <CropDemo src={src}></CropDemo>
      <Versions></Versions>
    </>
  )
}

export default App
