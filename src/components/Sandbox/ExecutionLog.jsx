import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

export const ExecutionLog = ({ steps, errors }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'processing':
        return <FiLoader className="text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-3">
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-bold text-red-700 mb-2">Validation Errors:</h4>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-red-600 text-sm">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-start gap-3">
              <div className="pt-1">{getStatusIcon(step.status)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  Step {step.step}: {step.nodeType}
                </p>
                <p className="text-gray-600 text-sm mt-1">{step.message}</p>
                <p className="text-xs text-gray-400 mt-1">Node ID: {step.nodeId}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
