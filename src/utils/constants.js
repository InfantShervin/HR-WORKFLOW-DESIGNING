export const NODE_TYPES = {
  START: 'start',
  TASK: 'task',
  APPROVAL: 'approval',
  AUTOMATED: 'automated',
  END: 'end',
};

export const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'CEO'];

export const NODE_STYLES = {
  start: {
    background: '#10b981',
    border: '2px solid #059669',
    color: 'white',
  },
  task: {
    background: '#3b82f6',
    border: '2px solid #1d4ed8',
    color: 'white',
  },
  approval: {
    background: '#f59e0b',
    border: '2px solid #d97706',
    color: 'white',
  },
  automated: {
    background: '#8b5cf6',
    border: '2px solid #6d28d9',
    color: 'white',
  },
  end: {
    background: '#ef4444',
    border: '2px solid #dc2626',
    color: 'white',
  },
};

export const DEFAULT_NODE_WIDTH = 180;
export const DEFAULT_NODE_HEIGHT = 60;

export const GRID_SIZE = 20;
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2;

export const VALIDATION_RULES = {
  START: {
    maxIncoming: 0,
    minOutgoing: 1,
  },
  END: {
    minIncoming: 1,
    maxOutgoing: 0,
  },
  TASK: {
    minIncoming: 1,
    minOutgoing: 1,
  },
  APPROVAL: {
    minIncoming: 1,
    minOutgoing: 1,
  },
  AUTOMATED: {
    minIncoming: 1,
    minOutgoing: 1,
  },
};
