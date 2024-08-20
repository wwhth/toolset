
import { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import './index.css'
interface IProps {
  children?: ReactNode
}
const Chartlet: FC<IProps> = memo(() => {
  const [img, setImg] = useState<string>('')
  useEffect(() => {
    getChartletUrl()
  }, [])
  async function getChartletUrl(): Promise<string> {
    const img = await window.api.invoke('getChartletUrl')
    setImg(img)
    return img
  }
  async function closeChartlet(): Promise<void> {
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
