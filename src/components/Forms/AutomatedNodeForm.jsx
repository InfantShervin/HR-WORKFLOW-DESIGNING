import React, { useState, useEffect } from 'react';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import { workflowService } from '../../api/workflowService';
import { useUIStore } from '../../store/uiStore';

export const AutomatedNodeForm = ({ data, onChange, errors }) => {
  const [automations, setAutomations] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const { addNotification } = useUIStore();

  useEffect(() => {
    workflowService.fetchAutomations()
      .then(setAutomations)
      .catch(err => addNotification(err.message, 'error'));
  }, []);

  useEffect(() => {
    if (data.actionId) {
      const action = automations.find(a => a.id === data.actionId);
      setSelectedAction(action);
    }
  }, [data.actionId, automations]);

  return (
    <>
      <DynamicFieldRenderer
        field={{ name: 'title', label: 'Step Title', type: 'text' }}
        value={data.title}
        onChange={(value) => onChange({ ...data, title: value })}
        error={errors.title}
      />

      <DynamicFieldRenderer
        field={{
          name: 'actionId',
          label: 'Action',
          type: 'select',
          options: automations.map(a => a.label),
        }}
        value={selectedAction?.label || ''}
        onChange={(value) => {
          const action = automations.find(a => a.label === value);
          onChange({
            ...data,
            actionId: action?.id || '',
            actionParams: {},
          });
        }}
        error={errors.actionId}
      />

      {selectedAction && selectedAction.params && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-medium text-gray-700 mb-3">Action Parameters:</p>
          {selectedAction.params.map((param) => (
            <DynamicFieldRenderer
              key={param}
              field={{ name: param, label: param, type: 'text' }}
              value={data.actionParams?.[param] || ''}
              onChange={(value) => onChange({
                ...data,
                actionParams: { ...data.actionParams, [param]: value }
              })}
            />
          ))}
        </div>
      )}
    </>
  );
};
