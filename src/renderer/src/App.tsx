// import Versions from './components/Versions'
// import CropDemo from './components/Cropper'
import Chartlet from './pages/chartlet'
import ShotScreen from './pages/shotScreen'
// import { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
function App(): JSX.Element {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={<h1>home</h1>}></Route>
          <Route path='/cut' element={<ShotScreen></ShotScreen>}></Route>
          <Route path='/chartlet' element={<Chartlet></Chartlet>}></Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
