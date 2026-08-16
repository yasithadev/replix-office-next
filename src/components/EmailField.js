import React from 'react';

export default function EmailField({
  value,
  onChange,
  error,
  name = 'email',
  label = 'Email',
  required = true,
  placeholder = 'jsmith@example.com',
}) {
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
        onChange={onChange}
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
}