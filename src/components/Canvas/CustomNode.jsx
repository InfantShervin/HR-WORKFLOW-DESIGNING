import React from 'react';
import { Handle, Position } from 'reactflow';

const baseClasses =
  'rounded-lg px-3 py-2 text-xs shadow-md border flex flex-col gap-1 min-w-[140px]';

const typeStyles = {
  start: 'bg-green-600 border-green-400 text-white',
  task: 'bg-slate-800 border-slate-500 text-slate-50',
  approval: 'bg-amber-500 border-amber-300 text-slate-900',
  automated: 'bg-sky-600 border-sky-400 text-white',
  end: 'bg-rose-600 border-rose-400 text-white',
  default: 'bg-slate-700 border-slate-500 text-slate-50',
};

export function CustomNode({ id, data, type }) {
  const nodeType = type || data?.type || 'default';
  const styles = typeStyles[nodeType] || typeStyles.default;

  const title =
    data?.title ||
    (nodeType === 'start'
      ? 'Start'
      : nodeType === 'task'
      ? 'Task'
      : nodeType === 'approval'
      ? 'Approval'
      : nodeType === 'automated'
      ? 'Automated Step'
      : nodeType === 'end'
      ? 'End'
      : 'Step');

  const subtitle =
    nodeType === 'start'
      ? 'Entry point'
      : nodeType === 'task'
      ? data?.description || 'Human task'
      : nodeType === 'approval'
      ? data?.approverRole || 'Manager approval'
      : nodeType === 'automated'
      ? data?.actionLabel || 'System action'
      : nodeType === 'end'
      ? data?.endMessage || 'Workflow complete'
      : data?.subtitle || '';

  return (
    <div className={`${baseClasses} ${styles}`}>
      {/* Handles */}
      {nodeType !== 'start' && (
        <Handle type="target" position={Position.Left} className="w-2 h-2" />
      )}
      {nodeType !== 'end' && (
        <Handle type="source" position={Position.Right} className="w-2 h-2" />
      )}

      {/* Content */}
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        <span className="text-[10px] opacity-80">#{id}</span>
      </div>
      {subtitle && (
        <div className="text-[10px] opacity-80 leading-snug">{subtitle}</div>
      )}
    </div>
  );
}
