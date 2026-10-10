import React, { useState, useRef } from 'react';
import EmailField from '../../components/EmailField';
import NameField from '../../components/NameField';
import ApiClient from '../api/ApiClient';
import ApiError from '../api/ApiError';

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
  const emailFieldRef = useRef(null);
  const firstNameRef = useRef(null);
  const secondNameRef = useRef(null);

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

    // Email validation (including its error message) is fully owned by
    // EmailField; we only need the valid boolean to gate submission.
    // firstName/secondName expose validate() too, but per original
    // behavior they aren't required and don't gate submit.
    const emailResult = emailFieldRef.current?.validate();
    const emailValid = emailResult ? emailResult.valid : true;

    setErrors(next);
    return Object.keys(next).length === 0 && emailValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await ApiClient.getInstance().post('/api/v1/user/create', form);

      setForm(initialForm);
      onNotify?.('Successfully Created', '', 'success');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data?.errors) {
          setErrors(err.data.errors);
        }
        onNotify?.('Create user failed', err.message, 'error');
      } else {
        console.error(err);
        onNotify?.('Create user failed', 'Something went wrong. Please try again.', 'error');
      }
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
          ref={emailFieldRef}
          value={form.email}
          onChange={handleChange}
          required
        />

        <NameField
          ref={firstNameRef}
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange}
          placeholder="John"
          required={false}
        />

        <NameField
          ref={secondNameRef}
          name="secondName"
          label="Second Name"
          value={form.secondName}
          onChange={handleChange}
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
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setErrors({});
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