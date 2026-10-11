"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import { pageMeta as dashboardMeta } from './dashboard/DashboardSection';
import { pageMeta as analyticsMeta } from './Analytics/AnalyticsSection';
import { pageMeta as projectsMeta } from './Projects/ProjectsSection';
import { pageMeta as settingsMeta } from './settings/SettingsSection';
import CreateUserContent, { pageMeta as createUserMeta } from './user-management/CreateUserContent';
import ModifyUserContent, { pageMeta as modifyUserMeta } from './user-management/ModifyUserContent';
import NotificationStack from '../components/NotificationStack';

const DashboardSection = dynamic(() => import('./dashboard/DashboardSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard…</div>,
});

const AnalyticsSection = dynamic(() => import('./Analytics/AnalyticsSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading analytics…</div>,
});

const ProjectsSection = dynamic(() => import('./Projects/ProjectsSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading projects…</div>,
});

const SettingsSection = dynamic(() => import('./settings/SettingsSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading settings…</div>,
});

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  const countRef = useRef(0); // was missing — needed for pushNotification below

  useEffect(() => {
    // Sidebar defaults to open on desktop, closed (off-canvas) on mobile.
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Only auto-close when shrinking into mobile, so the mobile overlay
      // doesn't pop open unexpectedly. Desktop open/closed is left to the
      // user's own toggling once set.
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionToHash = useMemo(
    () => ({
      Home: 'home',
      Analytics: 'analytics',
      Projects: 'projects',
      Settings: 'settings',
      'Create User': 'user-management/create-user',
      'Modify User': 'user-management/modify-user',
    }),
    []
  );

  const hashToSection = useMemo(
    () => Object.fromEntries(Object.entries(sectionToHash).map(([section, hash]) => [hash, section])),
    [sectionToHash]
  );

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const matchedSection = hash && hashToSection[hash] ? hashToSection[hash] : 'Home';
    setActiveItem(matchedSection);
  }, [hashToSection]);

  useEffect(() => {
    const nextHash = sectionToHash[activeItem] ? `#${sectionToHash[activeItem]}` : '';
    const currentHash = window.location.hash;

    if (currentHash !== nextHash) {
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.pushState({}, '', nextUrl);
    }
  }, [activeItem, sectionToHash]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const matchedSection = hash && hashToSection[hash] ? hashToSection[hash] : 'Home';
      setActiveItem(matchedSection);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [hashToSection]);

  // Each item can declare:
  //  - `permission`: a single string like 'analytics:view', or an array
  //    like ['user:create', 'user:manage'] (SideBar/Authentication treat an
  //    array as "at least one of"). Items/groups the user lacks permission
  //    for are filtered out by SideBar.
  //  - `icon`: a string matching a lucide-react export name (e.g. 'Home',
  //    'BarChart3', 'UserCog'). SideBar resolves this to the actual icon
  //    component — see https://lucide.dev/icons for the full name list.
  const menuItems = useMemo(
    () => [
      { name: 'Home', icon: 'Home' },
      { name: 'Analytics', icon: 'BarChart3'},
      { name: 'Projects', icon: 'FolderKanban' },
      {
        name: 'User Management',
        icon: 'Users',
        children: [
          {
            name: 'Operations',
            icon: 'Settings2',
            children: [
              { name: 'Create User', icon: 'UserPlus' },
              { name: 'Modify User', icon: 'UserCog', permission: 'READ_USER' },
              { name: 'Manage User', icon: 'ShieldCheck', permission: ['READ_USER', 'user:edit', 'user:delete'] },
            ],
          },
        ],
      },
      {
        name: 'Ui-Components',
        icon: 'Users',
        children: [
          {
            name: 'L2 Menu item',
            icon: 'Settings2',
            children: [
              { name: 'L3 Menu item1', icon: 'UserPlus' },
              { name: 'L3 Menu item2', icon: 'UserCog', permission: 'READ_USER' },
              { name: 'L3 Menu item3', icon: 'ShieldCheck', permission: ['READ_USER', 'user:edit', 'user:delete'] },
            ],
          },
          { name: 'DataTable', icon: 'Home' },
        ],
      },
      { name: 'Settings', icon: 'Settings' },
    ],
    []
  );

  // Single source of truth for pushing a notification — lives at the top level
  const pushNotification = (title,message,type) => {
    notificationRef.current?.push({
      title: title,
      message: message,
      notificationType:type
    });
  };

  const contentMap = useMemo(
    () => ({
      Home: {
        title: dashboardMeta.title,
        breadcrumb: dashboardMeta.breadcrumb,
        active: dashboardMeta.active ?? true,
        content: <DashboardSection />,
      },
      Analytics: {
        title: analyticsMeta.title,
        breadcrumb: analyticsMeta.breadcrumb,
        active: analyticsMeta.active ?? true,
        content: <AnalyticsSection />,
      },
      Projects: {
        title: projectsMeta.title,
        breadcrumb: projectsMeta.breadcrumb,
        active: projectsMeta.active ?? true,
        content: <ProjectsSection />,
      },
      Settings: {
        title: settingsMeta.title,
        breadcrumb: settingsMeta.breadcrumb,
        active: settingsMeta.active ?? true,
        content: <SettingsSection onTestNotification={pushNotification} />, // pass callback down
      },
      'Create User': {
        title: createUserMeta.title,
        breadcrumb: createUserMeta.breadcrumb,
        active: createUserMeta.active ?? true,
        content: <CreateUserContent onNotify={pushNotification} />,
      },
      'Modify User': {
        title: modifyUserMeta.title,
        breadcrumb: modifyUserMeta.breadcrumb,
        active: modifyUserMeta.active ?? true,
        content: <ModifyUserContent />,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeItem]
  );

  const currentView = contentMap[activeItem] || contentMap.Home;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <TopNav
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
        profileOpen={profileOpen}
        onToggleProfile={() => setProfileOpen((value) => !value)}
        searchQuery={searchQuery}
        onSearchChange={(event) => setSearchQuery(event.target.value)}
      />

      <div className="flex flex-1">
        <SideBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          menuItems={menuItems}
          activeItem={activeItem}
          onSelectItem={(itemName) => setActiveItem(itemName)}
        />

        <main className="flex-1 w-full px-4 py-6 md:px-8 transition-all duration-300 ease-in-out max-w-none">
          <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              {currentView.active !== false && currentView.breadcrumb.length > 0 ? (
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {currentView.breadcrumb.map((item, index) => (
                    <React.Fragment key={`${item}-${index}`}>
                      {index > 0 ? <span>/</span> : null}
                      <span className={index === currentView.breadcrumb.length - 1 ? 'font-semibold text-indigo-600' : ''}>{item}</span>
                    </React.Fragment>
                  ))}
                </div>
              ) : null}
              <h1 className="mt-2 text-2xl font-bold text-slate-900">{currentView.title}</h1>
            </div>
          </div>

          <div className="min-h-[300px]">{currentView.content}</div>
        </main>
      </div>
      <NotificationStack ref={notificationRef} />
    </div>
  );
}