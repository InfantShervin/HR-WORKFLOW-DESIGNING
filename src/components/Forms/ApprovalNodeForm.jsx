import React from 'react';
import { Input } from '../Common/Input';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import { APPROVER_ROLES } from '../../utils/constants';

export const ApprovalNodeForm = ({ data, onChange, errors }) => {
  const fields = [
    { name: 'title', label: 'Approval Title', type: 'text', required: true },
    { 
      name: 'approverRole', 
      label: 'Approver Role', 
      type: 'select', 
      options: APPROVER_ROLES,
      required: true 
    },
    { name: 'autoApproveThreshold', label: 'Auto-Approve Threshold (%)', type: 'number' },
  ];

  return (
    <>
      {fields.map((field) => (
        <DynamicFieldRenderer
          key={field.name}
          field={field}
          value={data[field.name]}
          onChange={(value) => onChange({ ...data, [field.name]: value })}
          error={errors[field.name]}
        />
      ))}
    </>
  );
};
