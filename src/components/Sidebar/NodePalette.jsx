import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { NODE_TYPES, NODE_STYLES } from '../../utils/constants';
import { Button } from '../Common/Button';

export const NodePalette = ({ onNodeAdd, collapsed = false }) => {
  const nodeTypes = [
    { type: NODE_TYPES.START, label: 'Start', icon: '▶️' },
    { type: NODE_TYPES.TASK, label: 'Task', icon: '📋' },
    { type: NODE_TYPES.APPROVAL, label: 'Approval', icon: '✅' },
    { type: NODE_TYPES.AUTOMATED, label: 'Automated', icon: '⚙️' },
    { type: NODE_TYPES.END, label: 'End', icon: '🏁' },
  ];

  const handleDragStart = (e, type) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('nodeType', type);
  };

  if (collapsed) {
    return (
      <div className="h-full flex flex-col gap-2 p-2">
        {nodeTypes.map(({ type, icon }) => (
          <button
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition text-xl"
            title={type}
          >
            {icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b">
        <h3 className="font-bold text-gray-900">Node Types</h3>
        <p className="text-xs text-gray-500">Drag to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {nodeTypes.map(({ type, label, icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            className="p-3 rounded-lg cursor-move hover:shadow-md transition bg-gray-50 border-2 border-transparent hover:border-gray-300"
            style={{
              backgroundColor: NODE_STYLES[type].background + '20',
              borderColor: NODE_STYLES[type].border,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{icon}</span>
              <span className="font-medium text-sm text-gray-900">{label}</span>
            </div>
            <p className="text-xs text-gray-600">
              {getNodeDescription(type)}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t space-y-2">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          className="text-xs"
        >
          📚 Templates
        </Button>
      </div>
    </div>
  );
};

const getNodeDescription = (type) => {
  const descriptions = {
    start: 'Workflow entry point',
    task: 'Human task to perform',
    approval: 'Manager/HR approval',
    automated: 'System action',
    end: 'Workflow completion',
  };
  return descriptions[type] || '';
};
