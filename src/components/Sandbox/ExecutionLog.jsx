import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

export const ExecutionLog = ({ steps = [], errors = [] }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <FiCheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'processing':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getNodeTypeColor = (nodeType) => {
    const colors = {
      start: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
      task: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
      approval: 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-300',
      automated: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
      end: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
    };
    return colors[nodeType] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        📋 Execution Steps ({steps.length})
      </div>

      {steps.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          No steps to display
        </div>
      ) : (
        steps.map((step, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-4 flex gap-4 transition-all hover:shadow-md ${getStatusColor(
              step.status
            )}`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 pt-1">
              {getStatusIcon(step.status)}
            </div>

            {/* Step Content */}
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Step #{step.step}
                </span>
                <span
                  className={`px-2 py-1 ${getNodeTypeColor(
                    step.nodeType
                  )} text-xs font-semibold rounded uppercase`}
                >
                  {step.nodeType}
                </span>
              </div>

              <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 leading-relaxed">
                {step.message}
              </p>

              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-200/30 dark:bg-gray-700/30 p-2 rounded">
                Node ID: <span className="font-semibold">{step.nodeId}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0 flex items-center">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  step.status === 'success'
                    ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200'
                    : 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200'
                }`}
              >
                {step.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))
      )}

      {errors && errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-sm font-bold text-red-900 dark:text-red-300 mb-3">
            ⚠️ Errors Encountered
          </div>
          <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-400 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExecutionLog;
