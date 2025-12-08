import React from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_STYLES } from '../../utils/constants';
import { useNodeSelection } from '../../hooks/useNodeSelection';

const NODE_ICONS = {
  start: '▶️',
  task: '📋',
  approval: '✅',
  automated: '⚙️',
  end: '🏁',
};

export const CustomNode = ({ data, id, isConnectable, type, selected }) => {
  const { selectNode } = useNodeSelection();

  const handleNodeClick = (e) => {
    e.stopPropagation();
    selectNode(id);
  };

  const style = NODE_STYLES[type] || NODE_STYLES.task;

  return (
    <div
      onClick={handleNodeClick}
      className={`
        px-4 py-3 rounded-lg min-w-[180px] cursor-pointer
        transition-all duration-200 border-2
        ${selected 
          ? 'ring-2 ring-blue-400 shadow-lg' 
          : 'shadow-md hover:shadow-lg'
        }
      `}
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
        color: style.color,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="bg-blue-500 w-2 h-2"
      />

      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{NODE_ICONS[type]}</span>
        <span className="text-xs font-bold uppercase opacity-75">
          {type}
        </span>
      </div>

      <p className="font-medium text-sm truncate">
        {data.title || 'Unnamed Node'}
      </p>

      {data.description && (
        <p className="text-xs opacity-75 mt-1 truncate">
          {data.description}
        </p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="bg-green-500 w-2 h-2"
      />
    </div>
  );
};
