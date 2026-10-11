'use client';

import React from 'react';

export const pageMeta = {
  title: 'Settings Dashboard',
  breadcrumb: ['Dashboard', 'Settings'],
  active: false,
};

export default function SettingsSection({ onTestNotification }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onTestNotification}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Test Notification
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">System settings</h2>
            <p className="mt-2 text-sm text-slate-500">Manage preferences, integrations, and account controls from here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}