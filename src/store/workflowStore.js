import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useWorkflowStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        nodes: [],
        edges: [],
        workflows: [],
        currentWorkflowId: null,

        // Actions
        addNode: (type, position) => {
          const newNode = {
            id: uuidv4(),
            type,
            position,
            data: getDefaultNodeData(type),
          };

          set(state => ({
            nodes: [...state.nodes, newNode],
          }));

          return newNode.id;
        },

        updateNode: (nodeId, data) => {
          set(state => ({
            nodes: state.nodes.map(node =>
              node.id === nodeId ? { ...node, data } : node
            ),
          }));
        },

        deleteNode: (nodeId) => {
          set(state => ({
            nodes: state.nodes.filter(n => n.id !== nodeId),
            edges: state.edges.filter(
              e => e.source !== nodeId && e.target !== nodeId
            ),
          }));
        },

        addEdge: (source, target) => {
          const newEdge = {
            id: `${source}-${target}`,
            source,
            target,
          };

          set(state => ({
            edges: [...state.edges, newEdge],
          }));
        },

        deleteEdge: (edgeId) => {
          set(state => ({
            edges: state.edges.filter(e => e.id !== edgeId),
          }));
        },

        updateEdge: (oldEdgeId, newSource, newTarget) => {
          const newEdgeId = `${newSource}-${newTarget}`;

          set(state => ({
            edges: state.edges.map(edge =>
              edge.id === oldEdgeId
                ? { ...edge, id: newEdgeId, source: newSource, target: newTarget }
                : edge
            ),
          }));
        },

        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),

        clearWorkflow: () => {
          set({ nodes: [], edges: [], currentWorkflowId: null });
        },

        // Workflow Management
        saveWorkflow: (name, description = '') => {
          const { nodes, edges, currentWorkflowId } = get();
          const workflow = {
            id: currentWorkflowId || uuidv4(),
            name,
            description,
            nodes,
            edges,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => {
            const existingIndex = state.workflows.findIndex(w => w.id === workflow.id);
            let updatedWorkflows = state.workflows;

            if (existingIndex >= 0) {
              updatedWorkflows = [
                ...state.workflows.slice(0, existingIndex),
                workflow,
                ...state.workflows.slice(existingIndex + 1),
              ];
            } else {
              updatedWorkflows = [...state.workflows, workflow];
            }

            return {
              workflows: updatedWorkflows,
              currentWorkflowId: workflow.id,
            };
          });

          return workflow.id;
        },

        loadWorkflow: (workflowId) => {
          const { workflows } = get();
          const workflow = workflows.find(w => w.id === workflowId);

          if (workflow) {
            set({
              nodes: workflow.nodes,
              edges: workflow.edges,
              currentWorkflowId: workflowId,
            });
            return true;
          }

          return false;
        },

        deleteWorkflow: (workflowId) => {
          set(state => ({
            workflows: state.workflows.filter(w => w.id !== workflowId),
            currentWorkflowId: state.currentWorkflowId === workflowId ? null : state.currentWorkflowId,
            nodes: state.currentWorkflowId === workflowId ? [] : state.nodes,
            edges: state.currentWorkflowId === workflowId ? [] : state.edges,
          }));
        },

        getAllWorkflows: () => get().workflows,

        // History (Undo/Redo)
        history: [],
        historyIndex: -1,

        saveHistory: () => {
          const { nodes, edges, history, historyIndex } = get();
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
          });
        },

        undo: () => {
          const { history, historyIndex } = get();
          if (historyIndex > 0) {
            const previousState = history[historyIndex - 1];
            set({
              nodes: previousState.nodes,
              edges: previousState.edges,
              historyIndex: historyIndex - 1,
            });
          }
        },

        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            set({
              nodes: nextState.nodes,
              edges: nextState.edges,
              historyIndex: historyIndex + 1,
            });
          }
        },
      }),
      {
        name: 'workflow-storage',
      }
    )
  )
);

// Helper function to get default data for node types
const getDefaultNodeData = (type) => {
  const defaults = {
    start: { title: 'Start Process' },
    task: { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
    approval: { title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 0 },
    automated: { title: 'Automated Step', actionId: '', actionParams: {} },
    end: { endMessage: 'Process Complete', summaryFlag: false },
  };
  return defaults[type] || {};
};
