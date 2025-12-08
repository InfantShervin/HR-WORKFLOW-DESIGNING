import React from 'react';
import { Input } from '../Common/Input';

export const StartNodeForm = ({ data, onChange, errors }) => {
  return (
    <>
      <Input
        label="Workflow Title"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="e.g., Start Employee Onboarding"
        error={errors.title}
      />
    </>
  );
};