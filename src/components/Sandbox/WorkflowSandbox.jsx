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

    // Reset previous results
    setResult(null);
    setExecutionTime(0);

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

    try {
      const response = await workflowService.simulate(workflowData);

      // ✅ FIX: Use result.executionTime directly (already in ms from mock)
      setExecutionTime(response.executionTime);
      setResult(response);

      if (response.status === 'success') {
        addNotification(
          `Simulation completed: ${response.totalSteps} steps executed`,
          'success'
        );
      } else {
        addNotification('Simulation encountered errors', 'error');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      addNotification(error.message || 'Simulation failed', 'error');
      setResult({
        status: 'error',
        steps: [],
        errors: [error.message || 'Unknown error'],
        totalSteps: 0,
      });
    }

    setIsSimulating(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        ✅ Workflow Sandbox
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test and simulate your workflow execution path
      </p>

      <Button
        onClick={handleSimulate}
        disabled={isSimulating || workflow.nodes.length === 0}
        className="w-full mb-4"
      >
        {isSimulating ? 'Running Simulation...' : '▶ Run Simulation'}
      </Button>

      {result && (
        <div className="mt-4 space-y-4">
          {/* ✅ FIX: Display execution time properly in milliseconds */}
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">Execution Time:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                  {executionTime.toFixed(2)}ms
                </span>
              </div>
              <div>
                <span className="font-semibold">Total Steps:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {result.totalSteps}
                </span>
              </div>
            </div>
          </div>

          {result.status === 'error' && result.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
              <h4 className="font-semibold text-red-800 dark:text-red-400 mb-3">
                ❌ Validation Errors:
              </h4>
              <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                {result.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {result.steps && result.steps.length > 0 && (
            <ExecutionLog steps={result.steps} errors={result.errors} />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowSandbox;
