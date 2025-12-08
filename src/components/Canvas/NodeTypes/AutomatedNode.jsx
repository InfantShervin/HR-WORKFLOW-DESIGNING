import React from 'react';
import { Handle, Position } from 'reactflow';

export function AutomatedNode({ data }) {
  return (
    <div className="rounded-lg bg-sky-600 text-white px-3 py-2 text-xs shadow-md">
      <div className="font-semibold">Automated Step</div>
      <div className="text-[10px] opacity-80">
        {data.title || 'System action'}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
