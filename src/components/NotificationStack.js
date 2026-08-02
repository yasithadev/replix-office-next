"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const NotificationStack = forwardRef(function NotificationStack(_props, ref) {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef(new Map());

  const dismiss = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
    const timeoutId = timers.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timers.current.delete(id);
    }
  };

  const push = (notification) => {
    const id = notification.id ?? Date.now().toString();
    const item = { id, ...notification };

    setNotifications((current) => [item, ...current]);

    const timeoutId = window.setTimeout(() => {
      dismiss(id);
    }, 3000);
    timers.current.set(id, timeoutId);
  };

  useImperativeHandle(ref, () => ({
    push,
  }));

  // Clear all timers on unmount
  React.useEffect(() => {
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
              onClick={() => dismiss(item.id)}
              className="text-sm font-medium text-slate-400 transition hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default NotificationStack;