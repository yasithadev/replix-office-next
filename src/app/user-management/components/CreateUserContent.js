import React, { useState } from 'react';
import EmailField from '../../../components/EmailField';
import NameField from '../../../components//NameField';

export const pageMeta = {
  title: '',
  breadcrumb: ['User Management', 'Create User'],
};

const initialForm = {
  userName: '',
  email: '',
  firstName: '',
  secondName: '',
  active: true,
};

export default function CreateUserContent({ onNotify }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.userName.trim()) {
      next.userName = 'Username is required';
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Email should be valid';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.message || 'Failed to create user.';

        if (data?.errors) {
          setErrors(data.errors);
        }

        onNotify?.('Create user failed',message, "error");
        return;
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      onNotify?.('Create user failed','Something went wrong. Please try again.',"error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Create User</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-slate-700">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={form.userName}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
              errors.userName
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-slate-200'
            }`}
            placeholder="jsmith"
          />
          {errors.userName && (
            <p className="mt-1 text-xs text-red-600">{errors.userName}</p>
          )}
        </div>

        <EmailField
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <NameField
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange}
          error={errors.firstName}
          placeholder="John"
          required={false}
        />

        <NameField
          name="secondName"
          label="Second Name"
          value={form.secondName}
          onChange={handleChange}
          error={errors.secondName}
          placeholder="Smith"
          required={false}
        />

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            Active account
          </label>
        </div>

        <div className="md:col-span-2">
          {success && (
            <p className="mb-3 text-sm text-green-600">User created successfully.</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setErrors({});
                setSuccess(false);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}