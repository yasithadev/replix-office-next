"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import NotificationCard from './NotificationCard';

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
        <NotificationCard
          key={item.id}
          title={item.title}
          message={item.message}
          notificationType={item.notificationType}
          style={{ marginTop: index === 0 ? 0 : 8 }}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </div>
  );
});

export default NotificationStack;