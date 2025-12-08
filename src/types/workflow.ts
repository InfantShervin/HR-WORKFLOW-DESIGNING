export interface WorkflowNodeData {
  id: string;
  type: 'start' | 'task' | 'approval' | 'automated' | 'end';
  position: { x: number; y: number };
  data: StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;
}

export interface StartNodeData {
  title: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: CustomField[];
}

export interface ApprovalNodeData {
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director' | 'CEO';
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData {
  title: string;
  actionId: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData {
  endMessage: string;
  summaryFlag?: boolean;
}

export interface CustomField {
  key: string;
  value: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiAction {
  id: string;
  label: string;
  description?: string;
  params: string[];
}

export interface SimulationStep {
  step: number;
  nodeId: string;
  nodeType: string;
  message: string;
  status: 'pending' | 'processing' | 'success' | 'error';
}

export interface SimulationResult {
  status: 'success' | 'error';
  steps: SimulationStep[];
  errors: string[];
  totalSteps: number;
  executionTime: number;
}
