/* eslint-disable react/display-name */
import { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import './index.css'
interface IProps {
  children?: ReactNode
}
const Chartlet: FC<IProps> = memo(() => {
  const [img, setImg] = useState<string>('')
  // const [imgWidth, setImgWidth] = useState<number>(0)
  // const [imgHeight, setImgHeight] = useState<number>(0)
  useEffect(() => {
    getChartletUrl()
  }, [])
  async function getChartletUrl(): Promise<string> {
    const img = await window.api.invoke('getChartletUrl')
    console.log('%c Line:21 🍔 img', 'color:#33a5ff', img)
    setImg(img)
    return img
  }
  async function closeChartlet(): Promise<void> {
    console.log('关闭')
    await window.api.send('closeChartlet')
  }

  return (
    <div className="chartlet">
      <div className="close">
        <button onClick={closeChartlet}>x</button>
      </div>
      <img src={img} alt="" />
    </div>
  )
})

export default Chartlet
