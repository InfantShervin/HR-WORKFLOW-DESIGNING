import React from 'react';
import { Handle, Position } from 'reactflow';

export function ApprovalNode({ data }) {
  return (
    <div className="rounded-lg bg-amber-500 text-slate-900 px-3 py-2 text-xs shadow-md">
      <div className="font-semibold">Approval</div>
      <div className="text-[10px] opacity-80">
        {data.title || 'Manager approval'}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
