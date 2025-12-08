import React from 'react';
import { Handle, Position } from 'reactflow';

export function TaskNode({ data }) {
  return (
    <div className="rounded-lg bg-slate-800 text-slate-50 px-3 py-2 text-xs shadow-md border border-slate-600">
      <div className="font-semibold">Task</div>
      <div className="text-[10px] opacity-80">
        {data.title || 'Task step'}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
