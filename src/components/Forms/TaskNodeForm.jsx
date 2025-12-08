import React from 'react';
import { Input } from '../Common/Input';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';

export const TaskNodeForm = ({ data, onChange, errors }) => {
  const fields = [
    { name: 'title', label: 'Task Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'assignee', label: 'Assignee', type: 'text' },
    { name: 'dueDate', label: 'Due Date', type: 'date' },
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
