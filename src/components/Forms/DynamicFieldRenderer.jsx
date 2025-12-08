import React from 'react';
import { Input } from '../Common/Input';
import { APPROVER_ROLES } from '../../utils/constants';

export const DynamicFieldRenderer = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleChange = (e) => {
    const newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(newValue);
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <Input
          type={field.type}
          label={field.label}
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
          error={error}
        />
      );

    case 'textarea':
      return (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <textarea
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <select
            value={value || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select {field.label}</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'date':
      return (
        <Input
          type="date"
          label={field.label}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={error}
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={field.name}
            checked={value || false}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );

    case 'key-value':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {(value || []).map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                placeholder="Key"
                value={item.key}
                onChange={(e) => {
                  const newValue = [...(value || [])];
                  newValue[idx].key = e.target.value;
                  onChange(newValue);
                }}
              />
              <Input
                placeholder="Value"
                value={item.value}
                onChange={(e) => {
                  const newValue = [...(value || [])];
                  newValue[idx].value = e.target.value;
                  onChange(newValue);
                }}
              />
              <button
                onClick={() => {
                  const newValue = (value || []).filter((_, i) => i !== idx);
                  onChange(newValue);
                }}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newValue = [...(value || []), { key: '', value: '' }];
              onChange(newValue);
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Add Field
          </button>
        </div>
      );

    default:
      return <Input label={field.label} value={value} onChange={handleChange} />;
  }
};
