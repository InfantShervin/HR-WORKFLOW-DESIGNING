import { useWorkflowStore } from '../store/workflowStore';
import { useCallback } from 'react';
import { validateWorkflow, validateNodeData } from '../utils/validation';

export const useWorkflow = () => {
  const store = useWorkflowStore();

  const addNode = useCallback((type, position) => {
    const nodeId = store.addNode(type, position);
    return nodeId;
  }, [store]);

  const updateNode = useCallback((nodeId, data) => {
    const errors = validateNodeData(nodeId, data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    store.updateNode(nodeId, data);
  }, [store]);

  const deleteNode = useCallback((nodeId) => {
    store.deleteNode(nodeId);
  }, [store]);

  const validateCurrentWorkflow = useCallback(() => {
    return validateWorkflow(store.nodes, store.edges);
  }, [store.nodes, store.edges]);

  const canAddEdge = useCallback((source, target) => {
    // Prevent self-loops
    if (source === target) return false;

    // Prevent duplicate edges
    if (store.edges.some(e => e.source === source && e.target === target)) {
      return false;
    }

    // Prevent backward edges (basic cycle prevention)
    // This is simplified - full cycle detection is in validation
    return true;
  }, [store.edges]);

  return {
    nodes: store.nodes,
    edges: store.edges,
    addNode,
    updateNode,
    deleteNode,
    addEdge: (source, target) => store.addEdge(source, target),
    deleteEdge: (edgeId) => store.deleteEdge(edgeId),
    setNodes: store.setNodes,
    setEdges: store.setEdges,
    validateWorkflow: validateCurrentWorkflow,
    canAddEdge,
    clearWorkflow: store.clearWorkflow,
    saveWorkflow: store.saveWorkflow,
    loadWorkflow: store.loadWorkflow,
    history: store.history,
    historyIndex: store.historyIndex,
    undo: store.undo,
    redo: store.redo,
    saveHistory: store.saveHistory,
  };
};
