import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const handle2 = async () => {
    const aaa = await window.api.ipcHandle2()
    console.log("%c Line:9 🍐 aaa", "color:#fca650", aaa);
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
      <Versions></Versions>
    </>
  )
}

export default App
