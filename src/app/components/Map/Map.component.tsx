import type { FC } from "react"

import NodePoint from "../NodePoint"

import { useMapQuery } from "@/app/hooks/useMapQuery"

import styles from './Map.module.css'

const Map: FC = () => {
  const { data, loading, error } = useMapQuery();

  console.log(data)

  const panX = 'test'
  const panY = 'test'
  const zoom = 'test'
  const rotation = 'test'

  const selectNode = (id: string) => {
    console.log(id)
  }

  // essentally a 15m x 12m map
  return (
    <div className={styles.map}>
      <svg viewBox="0 0 15000 12000" width="100%" height="100%">
        <g transform={`translate(${panX}, ${panY}) scale(${zoom}) rotate(${rotation})`}>
          {data && data.nodes.map(n => <NodePoint key={n.id} onClick={() => selectNode(n.id)} />)}
        </g>
      </svg>
    </div>
  )
}

export default Map