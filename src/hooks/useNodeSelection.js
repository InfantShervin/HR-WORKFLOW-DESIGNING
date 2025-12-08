import { useUIStore } from '../store/uiStore';
import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export const useNodeSelection = () => {
  const uiStore = useUIStore();
  const workflowStore = useWorkflowStore();

  const selectNode = useCallback((nodeId) => {
    uiStore.selectNode(nodeId);
  }, [uiStore]);

  const deselectNode = useCallback(() => {
    uiStore.deselectNode();
  }, [uiStore]);

  const getSelectedNode = useCallback(() => {
    const nodeId = uiStore.selectedNodeId;
    return workflowStore.nodes.find(n => n.id === nodeId) || null;
  }, [uiStore.selectedNodeId, workflowStore.nodes]);

  return {
    selectedNodeId: uiStore.selectedNodeId,
    selectedNode: getSelectedNode(),
    selectNode,
    deselectNode,
  };
};
