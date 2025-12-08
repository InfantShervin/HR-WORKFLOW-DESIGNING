import React, { useState, useEffect } from 'react';
import { useNodeSelection } from '../../hooks/useNodeSelection';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../Common/Button';
import { NODE_TYPES } from '../../utils/constants';
import { validateNodeData } from '../../utils/validation';

import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';

export const NodeFormPanel = ({ isOpen }) => {
  const { selectedNode } = useNodeSelection();
  const workflow = useWorkflow();
  const { addNotification, deselectNode } = useUIStore();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data);
      setErrors({});
    }
  }, [selectedNode]);

  const handleSave = async () => {
    setIsSaving(true);

    const nodeErrors = validateNodeData(selectedNode.type, formData);
    if (nodeErrors.length > 0) {
      setErrors({ general: nodeErrors.join(', ') });
      addNotification('Validation failed', 'error');
      setIsSaving(false);
      return;
    }

    try {
      workflow.updateNode(selectedNode.id, formData);
      addNotification('Node saved successfully', 'success');
      setErrors({});
    } catch (error) {
      addNotification(error.message, 'error');
      setErrors({ general: error.message });
    }

    setIsSaving(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      workflow.deleteNode(selectedNode.id);
      deselectNode();
      addNotification('Node deleted', 'success');
    }
  };

  if (!isOpen || !selectedNode) {
    return null;
  }

  const renderForm = () => {
    switch (selectedNode.type) {
      case NODE_TYPES.START:
        return <StartNodeForm data={formData} onChange={setFormData} errors={errors} />;
      case NODE_TYPES.TASK:
        return <TaskNodeForm data={formData} onChange={setFormData} errors={errors} />;
      case NODE_TYPES.APPROVAL:
        return <ApprovalNodeForm data={formData} onChange={setFormData} errors={errors} />;
      case NODE_TYPES.AUTOMATED:
        return <AutomatedNodeForm data={formData} onChange={setFormData} errors={errors} />;
      case NODE_TYPES.END:
        return <EndNodeForm data={formData} onChange={setFormData} errors={errors} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📝</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Edit Node</h3>
            <p className="text-xs text-gray-500">{selectedNode.type} • {selectedNode.id}</p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {renderForm()}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button
          onClick={handleSave}
          loading={isSaving}
          fullWidth
          className="flex-1"
        >
          💾 Save Changes
        </Button>
        <Button
          onClick={handleDelete}
          variant="danger"
          className="flex-1"
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  );
};
