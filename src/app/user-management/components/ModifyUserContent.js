import React from 'react';

export const pageMeta = {
  title: 'Modify User',
  breadcrumb: ['Dashboard', 'User Management', 'Modify User'],
};

export default function ModifyUserContent() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Modify User</h2>
          <p className="mt-2 text-sm text-slate-600">Adjust account details, permissions, or status for an existing user.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-medium text-slate-900">Account Updates</h3>
          <p className="mt-1 text-sm text-slate-600">Edit profile values or update contact information as needed.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-medium text-slate-900">Permission Review</h3>
          <p className="mt-1 text-sm text-slate-600">Review and change the user&apos;s role or access restrictions.</p>
        </div>
      </div>
    </div>
  );
}
