import type { FC, SVGProps } from "react";

const NodePoint: FC<SVGProps<SVGCircleElement>> = ({ ...rest }) => <circle {...rest} />

export default NodePoint