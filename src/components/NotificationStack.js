"use client";

import React, { useEffect, useRef } from 'react';

export default function NotificationStack({ notifications, onDismiss }) {
  const scheduledIds = useRef(new Set());
  const timers = useRef(new Map());

  useEffect(() => {
    const currentIds = new Set(notifications.map((n) => n.id));

    // Schedule a timer for any notification that doesn't have one yet
    notifications.forEach((item) => {
      if (!scheduledIds.current.has(item.id)) {
        scheduledIds.current.add(item.id);
        const timeoutId = window.setTimeout(() => {
          onDismiss(item.id);
          scheduledIds.current.delete(item.id);
          timers.current.delete(item.id);
        }, 3000);
        timers.current.set(item.id, timeoutId);
      }
    });

    // Clean up timers for notifications that were dismissed early (e.g. manual close)
    scheduledIds.current.forEach((id) => {
      if (!currentIds.has(id)) {
        const timeoutId = timers.current.get(id);
        if (timeoutId) window.clearTimeout(timeoutId);
        scheduledIds.current.delete(id);
        timers.current.delete(id);
      }
    });
  }, [notifications, onDismiss]);

  // Clear all timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return (
    <div className="fixed right-4 top-20 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {notifications.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80"
          style={{ marginTop: index === 0 ? 0 : 8 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">{item.title}</div>
              <div className="mt-1 text-sm text-slate-600">{item.message}</div>
            </div>
            <button
              onClick={() => onDismiss(item.id)}
              className="text-sm font-medium text-slate-400 transition hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}