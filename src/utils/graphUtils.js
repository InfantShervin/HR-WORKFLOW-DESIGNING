export const calculateLayout = (nodes, edges) => {
  // Simple hierarchical layout
  const levels = {};
  const visited = new Set();

  const assignLevel = (nodeId, level = 0) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    if (!levels[nodeId]) levels[nodeId] = level;
    levels[nodeId] = Math.max(levels[nodeId], level);

    edges
      .filter(e => e.source === nodeId)
      .forEach(e => assignLevel(e.target, level + 1));
  };

  // Start from root nodes
  const rootNodes = nodes.filter(
    n => !edges.some(e => e.target === n.id)
  );

  rootNodes.forEach(n => assignLevel(n.id, 0));

  // Calculate positions
  const levelCounts = {};
  const levelPositions = {};

  Object.entries(levels).forEach(([nodeId, level]) => {
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  });

  return nodes.map(node => ({
    ...node,
    position: {
      x: (levels[node.id] || 0) * 250,
      y: (levelPositions[levels[node.id]] = (levelPositions[levels[node.id]] || 0) + 100),
    },
  }));
};

export const getNodeAncestors = (nodeId, edges) => {
  const ancestors = new Set();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    edges
      .filter(e => e.target === current)
      .forEach(e => {
        if (!ancestors.has(e.source)) {
          ancestors.add(e.source);
          queue.push(e.source);
        }
      });
  }

  return Array.from(ancestors);
};

export const getNodeDescendants = (nodeId, edges) => {
  const descendants = new Set();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    edges
      .filter(e => e.source === current)
      .forEach(e => {
        if (!descendants.has(e.target)) {
          descendants.add(e.target);
          queue.push(e.target);
        }
      });
  }

  return Array.from(descendants);
};

export const getPathBetweenNodes = (startId, endId, edges) => {
  const path = [];
  const visited = new Set();

  const dfs = (current) => {
    if (current === endId) {
      path.push(current);
      return true;
    }

    visited.add(current);

    for (const edge of edges.filter(e => e.source === current)) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) {
          path.unshift(current);
          return true;
        }
      }
    }

    return false;
  };

  dfs(startId);
  return path;
};
