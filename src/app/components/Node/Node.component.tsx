import type { FC, SVGProps } from "react";



const Node: FC<SVGProps<SVGCircleElement>> = ({ ...rest }) => <circle {...rest} />

export default Node