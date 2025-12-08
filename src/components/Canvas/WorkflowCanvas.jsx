import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
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

const nodeTypes = {
  custom: CustomNode,
};

export const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [executingNodeId, setExecutingNodeId] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const workflow = useWorkflow();
  const { selectNode } = useNodeSelection();
  const { addNotification } = useUIStore();
  const { fitView } = useReactFlow();

  const hasResetRef = React.useRef(false);

  // 🔁 Hard reset: clear any old nodes/edges from previous runs
  useEffect(() => {
    if (hasResetRef.current) return;
    hasResetRef.current = true;

    workflow.setNodes([]);
    workflow.setEdges([]);
  }, [workflow]);

  // Initialize test nodes ONLY ONCE
  useEffect(() => {
    if (!initialized && workflow.nodes.length === 0) {
      const startId = workflow.addNode('start', { x: 100, y: 100 });
      const taskId = workflow.addNode('task', { x: 300, y: 100 });
      const approvalId = workflow.addNode('approval', { x: 500, y: 100 });
      const automatedId = workflow.addNode('automated', { x: 700, y: 100 });
      const endId = workflow.addNode('end', { x: 900, y: 100 });

      workflow.addEdge(startId, taskId);
      workflow.addEdge(taskId, approvalId);
      workflow.addEdge(approvalId, automatedId);
      workflow.addEdge(automatedId, endId);

      setInitialized(true);
    }
  }, [initialized, workflow]);

  // Sync workflow nodes/edges to React Flow
  useEffect(() => {
    const rfNodes = workflow.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      selected: node.id === selectedNodeId,
      data: {
        label: node.data?.label || getDefaultLabel(node.type),
        type: node.type,
        isActive: executingNodeId === node.id && simulationRunning,
        onLabelChange: (newLabel) => {
          workflow.setNodes(
            workflow.nodes.map((n) =>
              n.id === node.id
                ? { ...n, data: { ...n.data, label: newLabel } }
                : n
            )
          );
        },
      },
    }));

    const rfEdges = workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      markerEnd: { type: MarkerType.ArrowClosed },
    }));

    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [workflow.nodes, workflow.edges, setNodes, setEdges, selectedNodeId, executingNodeId, simulationRunning]);

  const getDefaultLabel = (type) => {
    const labels = {
      start: 'Start',
      task: 'Task',
      approval: 'Approval',
      automated: 'Automated',
      end: 'End',
    };
    return labels[type] || 'Node';
  };

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const updatedNodes = changes
        .filter((c) => c.type === 'position' && c.position)
        .map((c) => ({
          id: c.id,
          position: c.position,
        }));

      updatedNodes.forEach((update) => {
        workflow.setNodes(
          workflow.nodes.map((n) =>
            n.id === update.id ? { ...n, position: update.position } : n
          )
        );
      });
    },
    [onNodesChange, workflow]
  );

  const handleConnect = useCallback(
    (connection) => {
      workflow.addEdge(connection.source, connection.target);
      setEdges((eds) =>
        addEdge(
          { ...connection, markerEnd: { type: MarkerType.ArrowClosed } },
          eds
        )
      );
      addNotification('Edge created', 'success');
    },
    [workflow, setEdges, addNotification]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('nodeType');

      if (!nodeType) {
        addNotification('Invalid node type', 'error');
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const nodeId = workflow.addNode(nodeType, position);
      const newNode = workflow.nodes.find((n) => n.id === nodeId);

      if (newNode) {
        setNodes((nds) => [
          ...nds,
          {
            id: newNode.id,
            type: 'custom',
            position: newNode.position,
            data: {
              label: getDefaultLabel(nodeType),
              type: nodeType,
              isActive: false,
              onLabelChange: (newLabel) => {
                workflow.setNodes(
                  workflow.nodes.map((n) =>
                    n.id === newNode.id
                      ? { ...n, data: { ...n.data, label: newLabel } }
                      : n
                  )
                );
              },
            },
          },
        ]);
        addNotification(`${nodeType} node added`, 'success');
      }
    },
    [workflow, setNodes, addNotification]
  );

  const handleNodeClick = useCallback(
    (_, node) => {
      selectNode(node.id);
      setSelectedNodeId(node.id);
    },
    [selectNode]
  );

  const handleEdgeClick = useCallback(
    (_, edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      workflow.deleteEdge(edge.id);
      addNotification('Edge deleted', 'success');
    },
    [setEdges, workflow, addNotification]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    setSelectedNodeId(null);
  }, [selectNode]);

  // ✅ COMPUTE VALIDATION ERRORS FROM CURRENT STATE (BFS reachability check)
  const validationErrors = React.useMemo(() => {
    const startNode = workflow.nodes.find((n) => n.type === 'start');
    if (!startNode) {
      return ['No Start node found'];
    }

    // BFS to find all nodes reachable from Start
    const reachable = new Set();
    const queue = [startNode.id];
    reachable.add(startNode.id);

    while (queue.length > 0) {
      const current = queue.shift();
      workflow.edges
        .filter((e) => e.source === current)
        .forEach((e) => {
          if (!reachable.has(e.target)) {
            reachable.add(e.target);
            queue.push(e.target);
          }
        });
    }

    // Any node not in reachable is invalid
    const unreachableNodes = workflow.nodes.filter(
      (n) => !reachable.has(n.id)
    );

    return unreachableNodes.map(
      (n) => `Node ${n.id} (${n.type}) is unreachable from Start node`
    );
  }, [workflow.nodes, workflow.edges]);

  // ✅ NEW: Get ALL execution steps from Start using BFS (supports branching)
  const getExecutionSteps = () => {
    const startNode = workflow.nodes.find((n) => n.type === 'start');
    if (!startNode) return [];

    const steps = [];
    const visited = new Set();
    const queue = [{ id: startNode.id, depth: 0 }];

    visited.add(startNode.id);

    while (queue.length > 0) {
      const current = queue.shift();
      steps.push(current);

      const outgoing = workflow.edges.filter((e) => e.source === current.id);
      outgoing.forEach((edge) => {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          queue.push({ id: edge.target, depth: current.depth + 1 });
        }
      });
    }

    return steps;
  };

  // ✅ UPDATED: runSimulation with validation check + BFS-based branching
  const runSimulation = useCallback(async () => {
    // 1) Check validation errors first
    if (validationErrors.length > 0) {
      addNotification('Workflow validation failed. Fix validation errors before simulation.', 'error');
      return;
    }

    const steps = getExecutionSteps();

    if (steps.length === 0) {
      addNotification('No valid workflow path found. Ensure there is a Start node.', 'error');
      return;
    }

    setSimulationRunning(true);
    setTotalSteps(steps.length);
    const startTime = performance.now();

    // 2) Animate each reachable node in BFS order (supports branching)
    for (const step of steps) {
      setExecutingNodeId(step.id);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5s per node
    }

    setExecutingNodeId(null);
    setExecutionTime(performance.now() - startTime);
    setSimulationRunning(false);
    addNotification(`✅ Simulation completed across ${steps.length} nodes!`, 'success');
  }, [validationErrors, addNotification, workflow.nodes, workflow.edges]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar with Run Simulation button + Execution info */}
      <div style={{ padding: '12px', background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <button
            onClick={runSimulation}
            disabled={simulationRunning}
            style={{
              padding: '8px 16px',
              background: simulationRunning ? '#d1d5db' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: simulationRunning ? 'not-allowed' : 'pointer',
              fontWeight: '600',
            }}
          >
            {simulationRunning ? '⏳ Running...' : '▶ Run Simulation'}
          </button>
        </div>

        {/* Execution stats (only show after simulation runs) */}
        {totalSteps > 0 && (
          <div style={{
            padding: '8px 12px',
            background: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#1e40af',
          }}>
            <span style={{ fontWeight: '500' }}>Execution Time:</span> {executionTime.toFixed(2)}ms
            {' | '}
            <span style={{ fontWeight: '500' }}>Total Steps:</span> {totalSteps}
          </div>
        )}
      </div>

      {/* React Flow Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
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

      {/* ✅ VALIDATION ERRORS PANEL - Only shows if there are actual errors */}
      {validationErrors.length > 0 && (
        <div
          style={{
            padding: '16px',
            background: '#fee2e2',
            borderTop: '1px solid #fecaca',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>
            Validation Errors:
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#991b1b' }}>
            {validationErrors.map((error, index) => (
              <li key={index} style={{ marginBottom: '4px', fontSize: '14px' }}>
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
