import React, { useState, forwardRef, useImperativeHandle } from 'react';

const NameField = forwardRef(function NameField(
  {
    value,
    onChange,
    name,
    label,
    required = true,
    placeholder = '',
  },
  ref
) {
  const [error, setError] = useState('');

  const validate = () => {
    let result = { valid: true, message: '' };

    if (required && !value.trim()) {
      result = { valid: false, message: `${label || 'This field'} is required` };
    }

    setError(result.valid ? '' : result.message);
    return result;
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  const handleChange = (e) => {
    // Strip anything that isn't a letter or space (blocks numbers + special chars)
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    e.target.value = filtered;
    if (error) setError('');
    onChange(e);
  };

  const blockInvalidKeys = (e) => {
    // Allow control keys (backspace, delete, arrows, tab, etc.)
    if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
    // Allow only letters and space
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={blockInvalidKeys}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:ring-red-200'
            : 'border-slate-300 focus:ring-slate-200'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default NameField;