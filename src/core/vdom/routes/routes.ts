import { VirtualNode } from '../vnode';

function buildVirtualNodeWithRoutes(
  node: VirtualNode,
  prevRoute: Array<number> = [],
  level: number = 0,
  idx: number = 0,
  withExistsRoute: boolean = false,
): VirtualNode {
  const iterations = node.children.length;

  node.route = [...prevRoute];

  if (!withExistsRoute) {
    node.route[level] = idx;

    if (iterations > 0) {
      level++;
    }
  }

  for (let i = 0; i < iterations; i++) {
    node.children[i] = buildVirtualNodeWithRoutes(node.children[i], node.route, level, i);
  }

  return node;
}

export {
  buildVirtualNodeWithRoutes, //
};
