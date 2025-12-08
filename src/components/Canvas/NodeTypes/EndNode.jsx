import React from 'react';
import { Handle, Position } from 'reactflow';

export function EndNode({ data }) {
  return (
    <div className="rounded-lg bg-rose-600 text-white px-3 py-2 text-xs shadow-md">
      <div className="font-semibold">End</div>
      <div className="text-[10px] opacity-80">
        {data.endMessage || 'End of workflow'}
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
