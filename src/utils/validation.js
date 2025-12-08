import { NODE_TYPES, VALIDATION_RULES } from './constants.js';

export const validateWorkflow = (nodes, edges) => {
  const errors = [];

  // Check if workflow is empty
  if (nodes.length === 0) {
    errors.push('Workflow must have at least one node');
    return errors;
  }

  // Check for Start Node
  const startNodes = nodes.filter(n => n.type === NODE_TYPES.START);
  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one Start node');
  }
  if (startNodes.length > 1) {
    errors.push('Workflow cannot have more than one Start node');
  }

  // Check for End Node
  const endNodes = nodes.filter(n => n.type === NODE_TYPES.END);
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End node');
  }

  // Check for cycles
  if (hasCycle(nodes, edges)) {
    errors.push('Workflow cannot contain cycles');
  }

  // Check node connectivity
  const inDegree = {};
  const outDegree = {};
  
  nodes.forEach(node => {
    inDegree[node.id] = 0;
    outDegree[node.id] = 0;
  });

  edges.forEach(edge => {
    outDegree[edge.source] = (outDegree[edge.source] || 0) + 1;
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  });

  // Validate each node type
  nodes.forEach(node => {
    const rules = VALIDATION_RULES[node.type.toUpperCase()];
    if (!rules) return;

    if (rules.maxIncoming !== undefined && inDegree[node.id] > rules.maxIncoming) {
      errors.push(`${node.type} node (${node.id}) cannot have more than ${rules.maxIncoming} incoming connections`);
    }

    if (rules.minIncoming !== undefined && inDegree[node.id] < rules.minIncoming) {
      errors.push(`${node.type} node (${node.id}) must have at least ${rules.minIncoming} incoming connection`);
    }

    if (rules.maxOutgoing !== undefined && outDegree[node.id] > rules.maxOutgoing) {
      errors.push(`${node.type} node (${node.id}) cannot have more than ${rules.maxOutgoing} outgoing connections`);
    }

    if (rules.minOutgoing !== undefined && outDegree[node.id] < rules.minOutgoing) {
      errors.push(`${node.type} node (${node.id}) must have at least ${rules.minOutgoing} outgoing connection`);
    }
  });

  // Check for unreachable nodes
  const reachable = new Set();
  const queue = [startNodes?.id].filter(Boolean);
  
  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (reachable.has(nodeId)) continue;
    reachable.add(nodeId);

    edges
      .filter(e => e.source === nodeId)
      .forEach(e => queue.push(e.target));
  }

  nodes.forEach(node => {
    if (!reachable.has(node.id)) {
      errors.push(`Node ${node.id} is unreachable from Start node`);
    }
  });

  return errors;
};

export const hasCycle = (nodes, edges) => {
  const visited = new Set();
  const recursionStack = new Set();

  const dfs = (nodeId) => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    edges
      .filter(e => e.source === nodeId)
      .forEach(edge => {
        if (!visited.has(edge.target)) {
          if (dfs(edge.target)) return true;
        } else if (recursionStack.has(edge.target)) {
          return true;
        }
      });

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
};

export const validateNodeData = (type, data) => {
  const errors = [];

  switch (type) {
    case NODE_TYPES.START:
      if (!data.title || data.title.trim() === '') {
        errors.push('Start node title is required');
      }
      break;

    case NODE_TYPES.TASK:
      if (!data.title || data.title.trim() === '') {
        errors.push('Task title is required');
      }
      if (data.dueDate && isNaN(new Date(data.dueDate).getTime())) {
        errors.push('Invalid due date format');
      }
      break;

    case NODE_TYPES.APPROVAL:
      if (!data.title || data.title.trim() === '') {
        errors.push('Approval node title is required');
      }
      if (!data.approverRole) {
        errors.push('Approver role is required');
      }
      break;

    case NODE_TYPES.AUTOMATED:
      if (!data.title || data.title.trim() === '') {
        errors.push('Automated step title is required');
      }
      if (!data.actionId) {
        errors.push('Action is required');
      }
      break;

    case NODE_TYPES.END:
      if (!data.endMessage || data.endMessage.trim() === '') {
        errors.push('End message is required');
      }
      break;
  }

  return errors;
};
