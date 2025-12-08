import React from 'react';
import { Handle, Position } from 'reactflow';

export function StartNode({ data }) {
  return (
    <div className="rounded-lg bg-green-600 text-white px-3 py-2 text-xs shadow-md">
      <div className="font-semibold">Start</div>
      <div className="text-[10px] opacity-80">
        {data.title || 'Entry point'}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
