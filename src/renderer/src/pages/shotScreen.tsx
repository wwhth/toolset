import { useCallback, useEffect, useState } from 'react'
import Screenshots, { Bounds } from 'react-screenshots'
import './index.css'
import 'react-screenshots/lib/style.css'

export default function ShotScreen(): JSX.Element {
  console.log('%c Line:8 🍧', 'color:#93c0a4')
  const [screenShotImg, setScreenShotImg] = useState('')
  useEffect(() => {
    getShotScreenImg()
  }, [])

  async function getShotScreenImg(): Promise<string> {
    const img = await window.api.invoke('snapshot')
    console.log('%c Line:21 🍔 img', 'color:#33a5ff', img)
    setScreenShotImg(img)
    return img
  }

  const onSave = useCallback((blob: Blob, bounds: Bounds) => {
    const downloadUrl = URL.createObjectURL(blob)
    console.log('%c Line:24 🥑 downloadUrl', 'color:#e41a6a', downloadUrl, bounds)
  }, [])

  const onCancel = useCallback(() => {
    window.api.send('close-win')
  }, [])

  const onOk = useCallback((blob: Blob, bounds: Bounds) => {
    const imgUrl = URL.createObjectURL(blob)
    window.api.cv(imgUrl)
    console.log('%c Line:34 🥕 downloadUrl', 'color:#b03734', imgUrl, bounds, blob)
    window.api.send('saveImgUrl', imgUrl, bounds)
  }, [])

  return (
    <div className="shot-screen-container">
      <Screenshots
        className="aaaa"
        url={screenShotImg}
        width={window.innerWidth}
        height={window.innerHeight}
        onSave={onSave}
        onCancel={onCancel}
        onOk={onOk}
      />
    </div>
  )
}
