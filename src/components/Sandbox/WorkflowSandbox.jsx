import React, { useState } from 'react';
import { workflowService } from '../../api/workflowService';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../Common/Button';
import { ExecutionLog } from './ExecutionLog';

export const WorkflowSandbox = ({ isOpen }) => {
  const workflow = useWorkflow();
  const { addNotification } = useUIStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);

  const handleSimulate = async () => {
    const workflowData = {
      nodes: workflow.nodes,
      edges: workflow.edges,
    };

    // Validate
    const errors = workflow.validateWorkflow();
    if (errors.length > 0) {
      setResult({
        status: 'error',
        steps: [],
        errors,
        totalSteps: 0,
      });
      addNotification('Workflow validation failed', 'error');
      return;
    }

    setIsSimulating(true);
    const startTime = performance.now();

    try {
      const response = await workflowService.simulate(workflowData);
      setExecutionTime(performance.now() - startTime);
      setResult(response);

      if (response.status === 'success') {
        addNotification(`Simulation completed: ${response.steps.length} steps`, 'success');
      } else {
        addNotification('Simulation encountered errors', 'error');
      }
    } catch (error) {
      addNotification(error.message, 'error');
      setResult({
        status: 'error',
        steps: [],
        errors: [error.message],
        totalSteps: 0,
      });
    }

    setIsSimulating(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200 p-6 max-h-[50vh] overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">🧪 Workflow Sandbox</h3>
        <p className="text-sm text-gray-600">Test and simulate your workflow</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          onClick={handleSimulate}
          loading={isSimulating}
          className="flex-1"
        >
          ▶️ Run Simulation
        </Button>
      </div>

      {result && (
        <>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <span className="font-medium">Execution Time:</span> {executionTime.toFixed(2)}ms
            {' | '}
            <span className="font-medium">Total Steps:</span> {result.totalSteps}
          </div>
          {/*
          <ExecutionLog
            steps={result.steps}
            errors={result.errors}
          />
           */}
        </>
      )}
    </div>
  );
};
