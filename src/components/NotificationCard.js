"use client";

import React from 'react';

const VARIANT_STYLES = {
  success: {
    container: 'border-emerald-200 bg-white',
    icon: 'bg-emerald-100 text-emerald-600',
    title: 'text-emerald-900',
    message: 'text-emerald-700',
    dismiss: 'text-emerald-400 hover:text-emerald-700',
    symbol: '✓',
  },
  error: {
    container: 'border-red-200 bg-white',
    icon: 'bg-red-100 text-red-600',
    title: 'text-red-900',
    message: 'text-red-700',
    dismiss: 'text-red-400 hover:text-red-700',
    symbol: '✕',
  },
};

function NotificationCard({ title, message, notificationType = 'success', style, onDismiss }) {
  const variant = VARIANT_STYLES[notificationType] ?? VARIANT_STYLES.success;

  return (
    <div
      className={`rounded-xl border p-4 shadow-xl shadow-slate-200/80 ${variant.container}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${variant.icon}`}>
            {variant.symbol}
          </div>
          <div>
            <div className={`text-sm font-semibold ${variant.title}`}>{title}</div>
            <div className={`mt-1 text-sm ${variant.message}`}>{message}</div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className={`text-sm font-medium transition ${variant.dismiss}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;