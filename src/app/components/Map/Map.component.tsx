import type { FC } from "react"

import styles from './Map.module.css'

const Map: FC = () => {
  const panX = 'test'
  const panY = 'test'
  const zoom = 'test'
  const rotation = 'test'

  return (
    <div className={styles["map-container"]}>
      <svg viewBox="0 0 15000 12000" width="100%" height="100%">
        <g transform={`translate(${panX}, ${panY}) scale(${zoom}) rotate(${rotation})`}>

        </g>
      </svg>
    </div>
  )
}

export default Map