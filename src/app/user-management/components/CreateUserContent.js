import React from 'react';

export const pageMeta = {
  title: 'Create User',
  breadcrumb: ['Dashboard', 'User Management', 'Create User'],
};

export default function CreateUserContent() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Create User</h2>
          <p className="mt-2 text-sm text-slate-600">Create a new user profile with role assignment and access rules.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-medium text-slate-900">User Details</h3>
          <p className="mt-1 text-sm text-slate-600">Capture the basic profile information for the new account.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-medium text-slate-900">Access Controls</h3>
          <p className="mt-1 text-sm text-slate-600">Assign permissions and define the initial access level.</p>
        </div>
      </div>
    </div>
  );
}
