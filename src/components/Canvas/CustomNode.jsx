import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const CustomNode = ({ data, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Node');

  // Use data.type directly - it's set by parent
  const nodeType = data.type || 'task';
  
  // Color mapping for node types
  const colorMap = {
    start: { bg: '#dbeafe', border: '#0284c7', text: '#0c4a6e', icon: '▶' },
    task: { bg: '#fef3c7', border: '#d97706', text: '#78350f', icon: '✓' },
    approval: { bg: '#fecaca', border: '#dc2626', text: '#7f1d1d', icon: '✋' },
    automated: { bg: '#d1fae5', border: '#059669', text: '#065f46', icon: '⚙' },
    end: { bg: '#fecdd3', border: '#dc2626', text: '#831010', icon: '■' },
  };

  const colors = colorMap[nodeType] || colorMap.task;

  const nodeStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: `2px solid ${colors.border}`,
    background: colors.bg,
    color: colors.text,
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    minWidth: '140px',
    maxWidth: '200px',
    wordWrap: 'break-word',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    cursor: 'pointer',
    ...(isSelected && {
      boxShadow: `0 0 0 2px white, 0 0 0 4px ${colors.border}`,
      transform: 'scale(1.05)',
    }),
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    background: 'white',
    color: colors.text,
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleSave = () => {
    if (data.onLabelChange) {
      data.onLabelChange(label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setLabel(data.label || 'New Node');
      setIsEditing(false);
    }
  };

  return (
    <div style={nodeStyle} onDoubleClick={() => setIsEditing(true)}>
      <Handle type="target" position={Position.Top} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '20px', lineHeight: '1' }}>
          {colors.icon}
        </div>
        
        {isEditing ? (
          <input
            style={inputStyle}
            value={label}
            onChange={handleLabelChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div style={{ fontWeight: '600', lineHeight: '1.2', minHeight: '20px', fontSize: '12px' }}>
            {label}
          </div>
        )}
        
        {data.isActive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '10px',
            color: 'inherit',
            animation: 'pulse-animation 1s ease-in-out infinite',
          }}>
            <span style={{
              display: 'inline-block',
              width: '5px',
              height: '5px',
              background: 'currentColor',
              borderRadius: '50%',
            }}></span>
            Executing
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />

      <style>{`
        @keyframes pulse-animation {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};