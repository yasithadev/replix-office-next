import React, { useState, forwardRef, useImperativeHandle } from 'react';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const EmailField = forwardRef(function EmailField(
  {
    value,
    onChange,
    name = 'email',
    label = 'Email',
    required = true,
    placeholder = 'jsmith@example.com',
  },
  ref
) {
  const [error, setError] = useState('');

  const validate = () => {
    let result = { valid: true, message: '' };

    if (required && !value.trim()) {
      result = { valid: false, message: 'Email is required' };
    } else if (value.trim() && !isValidEmail(value)) {
      result = { valid: false, message: 'Email should be valid' };
    }

    setError(result.valid ? '' : result.message);
    return result;
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  const handleChange = (e) => {
    if (error) setError('');
    onChange(e);
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="email"
        value={value}
        onChange={handleChange}
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

export default EmailField;
