import React from 'react';
import { FiMenu, FiSave, FiDownload, FiUpload, FiPlay } from 'react-icons/fi';
import { Button } from '../Common/Button';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useUIStore } from '../../store/uiStore';
import { workflowService } from '../../api/workflowService';

export const Header = ({ onToggleSidebar, onToggleSandbox, workflowName }) => {
  const workflow = useWorkflow();
  const { addNotification, toggleSaveModal, toggleImportModal } = useUIStore();

  const handleExport = () => {
    const workflowData = {
      name: workflowName || 'workflow',
      nodes: workflow.nodes,
      edges: workflow.edges,
      createdAt: new Date().toISOString(),
    };
    workflowService.exportAsJSON(workflowData);
    addNotification('Workflow exported successfully', 'success');
  };

  const handleImport = () => {
    toggleImportModal();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <FiMenu />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🚀 HR Workflow Designer
          </h1>
          <p className="text-sm text-gray-500">
            {workflowName ? `Editing: ${workflowName}` : 'Create a new workflow'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          title="Export workflow as JSON"
        >
          <FiDownload className="mr-2" /> Export
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleImport}
          title="Import workflow from JSON"
        >
          <FiUpload className="mr-2" /> Import
        </Button>
        <Button
          size="sm"
          onClick={() => toggleSaveModal()}
          title="Save workflow"
        >
          <FiSave className="mr-2" /> Save
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={onToggleSandbox}
          title="Test workflow"
        >
          <FiPlay className="mr-2" /> Test
        </Button>
      </div>
    </header>
  );
};
