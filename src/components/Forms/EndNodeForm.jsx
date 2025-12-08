import React from 'react';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';

export const EndNodeForm = ({ data, onChange, errors }) => {
  const fields = [
    { name: 'endMessage', label: 'End Message', type: 'textarea', required: true },
    { name: 'summaryFlag', label: 'Show Summary', type: 'checkbox' },
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