import { memo, useCallback, useEffect, useState } from 'react'
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


  return (<div className='chartlet'>
    <img src={img} alt="" /></div>)
})

export default Chartlet
