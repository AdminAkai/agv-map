import { useMemo } from "react";
import type { AgvNode } from "../utils/types";

export interface Connection {
  from: AgvNode;
  to: AgvNode;
}

export function useConnections(nodes: AgvNode[], maxNeighborDistance: number): Connection[] {
  return useMemo(() => {
    const connections: Connection[] = [];
    const seen = new Set<string>();

    const addEdge = (a: AgvNode, b: AgvNode) => {
      const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      connections.push({ from: a, to: b });
    };

    // same-x groups, sorted by y -> connect each node to its nearest
    // neighbor above and below it on that vertical line.
    const connectedByX = new Map<number, AgvNode[]>();
    for (const n of nodes) {
      if (!connectedByX.has(n.x)) connectedByX.set(n.x, []);
      connectedByX.get(n.x)!.push(n);
    }
    for (const group of connectedByX.values()) {
      group.sort((a, b) => a.y - b.y);
      for (let i = 0; i < group.length - 1; i++) {
        const a = group[i]!, b = group[i + 1]!;
        if (b.y - a.y <= maxNeighborDistance) addEdge(a, b);
      }
    }

    // same-y groups, sorted by x -> nearest neighbor left/right.
    const byY = new Map<number, AgvNode[]>();
    for (const n of nodes) {
      if (!byY.has(n.y)) byY.set(n.y, []);
      byY.get(n.y)!.push(n);
    }
    for (const group of byY.values()) {
      group.sort((a, b) => a.x - b.x);
      for (let i = 0; i < group.length - 1; i++) {
        const a = group[i]!, b = group[i + 1]!;
        if (b.x - a.x <= maxNeighborDistance) addEdge(a, b);
      }
    }

    return connections;
  }, [nodes, maxNeighborDistance]);
}