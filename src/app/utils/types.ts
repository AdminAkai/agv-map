// not gonna use graphql-codegen or something for a relatively simple project
export type Direction = "North" | "South" | "East" | "West";

export interface Charger {
  direction: Direction;
}

export interface Chute {
  direction: Direction;
}

// avoid naming collision with node
export interface AgvNode {
  id: string;
  x: number;
  y: number;
  code: number;
  name: string | null;
  directions: Direction[];
  charger: Charger | null;
  chute: Chute | null;
}

// avoid naming collision with map
export interface AgvMap {
  id: string;
  maxNeighborDistance: number;
  nodes: AgvNode[];
}