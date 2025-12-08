import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Header } from './Header';
import { NodePalette } from '../Sidebar/NodePalette';
import { WorkflowCanvas } from '../Canvas/WorkflowCanvas';
import { NodeFormPanel } from '../Forms/NodeFormPanel';
import { WorkflowSandbox } from '../Sandbox/WorkflowSandbox';
import { useUIStore } from '../../store/uiStore';
import { useWorkflowStore } from '../../store/workflowStore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';

export const MainLayout = () => {
  const {
    showSandbox,
    toggleSandbox,
    showFormPanel,
    sidebarOpen,
    toggleSidebar,
    showSaveModal,
    toggleSaveModal,
    showImportModal,
    toggleImportModal,
  } = useUIStore();

  const { saveWorkflow } = useWorkflowStore();
  const [workflowName, setWorkflowName] = useLocalStorage(
    'currentWorkflowName',
    '',
  );
  const [saveDialogName, setSaveDialogName] = useState(workflowName);

  const handleSaveWorkflow = () => {
    if (!saveDialogName.trim()) {
      alert('Please enter a workflow name');
      return;
    }
    saveWorkflow(saveDialogName);
    setWorkflowName(saveDialogName);
    toggleSaveModal();
  };

  const handleImportWorkflow = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workflow = JSON.parse(event.target.result);
        // TODO: Load workflow into canvas using your workflow store
        console.log('Imported workflow:', workflow);
        alert('Workflow imported successfully');
        toggleImportModal();
      } catch (error) {
        alert('Invalid workflow file');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header
        onToggleSidebar={toggleSidebar}
        onToggleSandbox={toggleSandbox}
        workflowName={workflowName}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
       {/* Sidebar */}
       <div className="w-64 bg-red-500 border-r border-gray-200">
          <div style={{ color: 'white', padding: '20px' }}>TEST SIDEBAR</div>
          <NodePalette collapsed={!sidebarOpen} />
       </div>


        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>

          {/* Sandbox Panel */}
          {showSandbox && <WorkflowSandbox isOpen={showSandbox} />}
        </div>

        {/* Form Panel */}
        {showFormPanel && <NodeFormPanel isOpen={showFormPanel} />}
      </div>

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={toggleSaveModal}
        title="Save Workflow"
        footer={
          <>
            <Button variant="secondary" onClick={toggleSaveModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
          </>
        }
      >
        <Input
          label="Workflow Name"
          value={saveDialogName}
          onChange={(e) => setSaveDialogName(e.target.value)}
          placeholder="e.g., Employee Onboarding"
          autoFocus
        />
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={toggleImportModal}
        title="Import Workflow"
        footer={
          <Button variant="secondary" onClick={toggleImportModal}>
            Close
          </Button>
        }
      >
        <input
          type="file"
          accept=".json"
          onChange={handleImportWorkflow}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </Modal>
    </div>
  );
};
