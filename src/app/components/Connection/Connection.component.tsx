import type { FC, SVGLineElementAttributes } from "react"

const Connection: FC<SVGLineElementAttributes<SVGLineElement>> = ({ ...rest }) => <line {...rest} />


export default Connection