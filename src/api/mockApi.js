// Mock Automated Actions Database
export const mockAutomations = [
  {
    id: 'send-email',
    label: 'Send Email',
    description: 'Send an email notification',
    params: ['to', 'subject', 'body'],
    icon: '📧',
  },
  {
    id: 'generate-doc',
    label: 'Generate Document',
    description: 'Generate a PDF or document',
    params: ['template', 'recipient', 'format'],
    icon: '📄',
  },
  {
    id: 'create-account',
    label: 'Create User Account',
    description: 'Create a new user account in the system',
    params: ['firstName', 'lastName', 'email', 'department'],
    icon: '👤',
  },
  {
    id: 'assign-task',
    label: 'Assign Task',
    description: 'Assign a task to a team member',
    params: ['assignee', 'taskName', 'priority', 'dueDate'],
    icon: '✅',
  },
  {
    id: 'send-sms',
    label: 'Send SMS',
    description: 'Send an SMS notification',
    params: ['phoneNumber', 'message'],
    icon: '📱',
  },
  {
    id: 'update-database',
    label: 'Update Database',
    description: 'Update records in the database',
    params: ['table', 'recordId', 'updates'],
    icon: '💾',
  },
  {
    id: 'create-meeting',
    label: 'Create Meeting',
    description: 'Schedule a calendar meeting',
    params: ['organizer', 'attendees', 'date', 'time', 'subject'],
    icon: '📅',
  },
  {
    id: 'log-audit',
    label: 'Log Audit Trail',
    description: 'Log an entry to audit trail',
    params: ['action', 'userId', 'details'],
    icon: '🔍',
  },
];

// API Endpoints Simulation
export const getAutomations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAutomations);
    }, 300);
  });
};

export const getAutomationById = async (actionId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const action = mockAutomations.find((a) => a.id === actionId);
      if (action) {
        resolve(action);
      } else {
        reject(new Error(`Action with id ${actionId} not found`));
      }
    }, 200);
  });
};

// ✅ FIXED: Proper closing braces for all if statements
export const simulateWorkflow = async (workflow) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { nodes, edges } = workflow;

      // Validation errors
      const validationErrors = [];

      if (!nodes || nodes.length === 0) {
        validationErrors.push('Workflow must have at least one node');
      }

      const hasStart = nodes.some((n) => n.type === 'start');
      const hasEnd = nodes.some((n) => n.type === 'end');

      if (!hasStart) {
        validationErrors.push('Workflow must have a Start node');
      }

      if (!hasEnd) {
        validationErrors.push('Workflow must have an End node');
      }

      // If validation errors exist, return early
      if (validationErrors.length > 0) {
        return resolve({
          status: 'error',
          steps: [],
          errors: validationErrors,
          totalSteps: 0,
          executionTime: 0,
        });
      }

      // ✅ SIMULATE EXECUTION with BFS traversal
      const startNode = nodes.find((n) => n.type === 'start');
      const steps = [];
      const visitedNodes = new Set();
      const queue = [{ nodeId: startNode.id, depth: 0 }];
      let stepNumber = 1;

      // Breadth-first search to simulate workflow execution
      while (queue.length > 0 && stepNumber <= 50) {
        const { nodeId } = queue.shift();

        if (visitedNodes.has(nodeId)) continue;

        visitedNodes.add(nodeId);
        const node = nodes.find((n) => n.id === nodeId);

        if (node) {
          steps.push({
            step: stepNumber,
            nodeId: node.id,
            nodeType: node.type,
            message: generateStepMessage(node),
            status: 'success',
          });

          // Find next connected nodes
          const nextEdges = edges.filter((e) => e.source === nodeId);
          nextEdges.forEach((edge) => {
            if (!visitedNodes.has(edge.target)) {
              queue.push({ nodeId: edge.target, depth: 1 });
            }
          });

          stepNumber++;
        }
      }

      // If no steps were created, return error
      if (steps.length === 0) {
        steps.push({
          step: 1,
          nodeId: startNode.id,
          nodeType: 'start',
          message: 'Workflow started but no connected nodes found',
          status: 'error',
        });
      }

      // ✅ Return proper execution time (simulated)
      resolve({
        status: 'success',
        steps,
        errors: [],
        totalSteps: steps.length,
        executionTime: Math.random() * 500 + 100, // 100-600ms simulation
      });
    }, 600);
  });
};

// ✅ FIXED: Correct array access for startNodes.id
export const validateWorkflowStructure = async (nodes, edges) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const errors = [];

      if (nodes.length === 0) {
        errors.push('Workflow is empty');
      }

      const startNodes = nodes.filter((n) => n.type === 'start');
      if (startNodes.length === 0) {
        errors.push('Missing Start node');
      } else if (startNodes.length > 1) {
        errors.push('Only one Start node allowed');
      }

      const endNodes = nodes.filter((n) => n.type === 'end');
      if (endNodes.length === 0) {
        errors.push('Missing End node');
      }

      // Check for unreachable nodes
      if (startNodes.length > 0) {
        const reachable = new Set();
        // ✅ FIX: Access first element of array correctly
        const queue = [startNodes.id];

        while (queue.length > 0) {
          const nodeId = queue.shift();
          if (reachable.has(nodeId)) continue;

          reachable.add(nodeId);
          edges
            .filter((e) => e.source === nodeId)
            .forEach((e) => queue.push(e.target));
        }

        nodes.forEach((node) => {
          if (!reachable.has(node.id)) {
            errors.push(
              `Node "${node.data?.title || node.id}" is unreachable`
            );
          }
        });
      }

      resolve({
        isValid: errors.length === 0,
        errors,
      });
    }, 300);
  });
};

// Helper function to generate step messages
const generateStepMessage = (node) => {
  const messages = {
    start: `Workflow started: ${node.data?.title || 'Start'}`,
    task: `Task assigned: ${node.data?.title || 'Task'}. Assigned to: ${
      node.data?.assignee || 'Unassigned'
    }`,
    approval: `Approval required from: ${
      node.data?.approverRole || 'Manager'
    }. Node: ${node.data?.title || 'Approval'}`,
    automated: `Executing automation: ${node.data?.title || 'Automated Action'}`,
    end: `Workflow completed: ${node.data?.endMessage || 'Process finished'}`,
  };

  return messages[node.type] || 'Processing node...';
};

// Export workflow template examples
export const getWorkflowTemplates = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'onboarding',
          name: 'Employee Onboarding',
          description: 'Complete workflow for new employee onboarding',
          thumbnail: '👤',
        },
        {
          id: 'leave-approval',
          name: 'Leave Approval',
          description: 'Leave request and approval workflow',
          thumbnail: '📅',
        },
        {
          id: 'document-verification',
          name: 'Document Verification',
          description: 'Document upload and verification process',
          thumbnail: '📄',
        },
      ]);
    }, 400);
  });
};
