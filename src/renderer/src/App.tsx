// import Versions from './components/Versions'
// import CropDemo from './components/Cropper'
import ShotScreen from './pages/shotScreen'
// import { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
function App(): JSX.Element {
  // const [src, setSrc] = useState('')
  // // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // window.api.snapshot((val) => {
  //   console.log('%c Line:9 🍐 val', 'color:#fca650', val)
  //   setSrc(val)
  // })
  // const handle2 = async (): Promise<void> => {
  //   const aaa = await window.api.ipcHandle2()
  //   console.log('%c Line:9 🍐 aaa', 'color:#fca650', aaa)
  // }
  // window.api.test()
  return (
    <>
      {/* <CropDemo src={src}></CropDemo>
      <Versions></Versions> */}
      <HashRouter>
        <Routes>
          <Route path='/' element={<h1>home</h1>}></Route>
          <Route path='/cut' element={<ShotScreen></ShotScreen>}></Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
