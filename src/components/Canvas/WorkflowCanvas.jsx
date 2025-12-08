import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNodeSelection } from '../../hooks/useNodeSelection';
import { useUIStore } from '../../store/uiStore';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  custom: CustomNode,
  start: CustomNode,
  task: CustomNode,
  approval: CustomNode,
  automated: CustomNode,
  end: CustomNode,
};

export const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const workflow = useWorkflow();
  const { selectNode } = useNodeSelection();
  const { addNotification } = useUIStore();
  const { fitView } = useReactFlow();

  // Sync with store
  useEffect(() => {
    if (workflow.nodes.length > 0 || workflow.edges.length > 0) {
      const rfNodes = workflow.nodes.map(node => ({
        ...node,
        data: node.data,
      }));
      const rfEdges = workflow.edges.map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed },
      }));
      setNodes(rfNodes);
      setEdges(rfEdges);
    }
  }, []);

  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    const updatedNodes = changes
      .filter(c => c.type === 'position' && c.position)
      .map(c => ({
        id: c.id,
        position: c.position,
      }));

    updatedNodes.forEach(update => {
      workflow.setNodes(
        workflow.nodes.map(n =>
          n.id === update.id ? { ...n, position: update.position } : n
        )
      );
    });
  }, [onNodesChange, workflow]);

  const handleConnect = useCallback((connection) => {
    if (!workflow.canAddEdge(connection.source, connection.target)) {
      addNotification('Cannot create this edge', 'error');
      return;
    }

    const newEdge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      markerEnd: { type: MarkerType.ArrowClosed },
    };

    workflow.addEdge(connection.source, connection.target);
    setEdges(eds => addEdge({ ...connection, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
    addNotification('Edge created successfully', 'success');
  }, [workflow, setEdges, addNotification]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const nodeType = event.dataTransfer.getData('nodeType');

    if (!nodeType) {
      addNotification('Invalid node type', 'error');
      return;
    }

    const position = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    };

    const nodeId = workflow.addNode(nodeType, position);

    const newNode = workflow.nodes.find(n => n.id === nodeId);
    if (newNode) {
      setNodes(nds => [
        ...nds,
        {
          id: newNode.id,
          type: newNode.type,
          position: newNode.position,
          data: newNode.data,
        },
      ]);
    }

    addNotification(`${nodeType} node added`, 'success');
  }, [workflow, setNodes, addNotification]);

  const handleNodeClick = useCallback((_, node) => {
    selectNode(node.id);
    setSelectedNodeId(node.id);
  }, [selectNode]);

  const handleEdgeClick = useCallback((_, edge) => {
    setEdges(eds => eds.filter(e => e.id !== edge.id));
    workflow.deleteEdge(edge.id);
    addNotification('Edge deleted', 'success');
  }, [setEdges, workflow, addNotification]);

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    setSelectedNodeId(null);
  }, [selectNode]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes.map(n => ({ ...n, selected: n.id === selectedNodeId }))}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
