"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import { pageMeta as dashboardMeta } from './components/sections/DashboardSection';
import { pageMeta as analyticsMeta } from './components/sections/AnalyticsSection';
import { pageMeta as projectsMeta } from './components/sections/ProjectsSection';
import { pageMeta as settingsMeta } from './components/sections/SettingsSection';
import CreateUserContent, { pageMeta as createUserMeta } from './user-management/components/CreateUserContent';
import ModifyUserContent, { pageMeta as modifyUserMeta } from './user-management/components/ModifyUserContent';

const DashboardSection = dynamic(() => import('./components/sections/DashboardSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard…</div>,
});

const AnalyticsSection = dynamic(() => import('./components/sections/AnalyticsSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading analytics…</div>,
});

const ProjectsSection = dynamic(() => import('./components/sections/ProjectsSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading projects…</div>,
});

const SettingsSection = dynamic(() => import('./components/sections/SettingsSection').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading settings…</div>,
});

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionToHash = useMemo(
    () => ({
      Home: 'dashboard/home',
      Analytics: 'dashboard/analytics',
      Projects: 'dashboard/projects',
      Settings: 'dashboard/settings',
      'Create User': 'dashboard/user-management/create-user',
      'Modify User': 'dashboard/user-management/modify-user',
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

  const menuItems = useMemo(
    () => [
      { name: 'Home' },
      { name: 'Analytics' },
      { name: 'Projects' },
      { name: 'Settings' },
      {
        name: 'User Management',
        children: [
          {
            name: 'Operations',
            children: [
              { name: 'Create User' },
              { name: 'Modify User' },
            ],
          },
        ],
      },
    ],
    []
  );

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
        content: <SettingsSection />,
      },
      'Create User': {
        title: createUserMeta.title,
        breadcrumb: createUserMeta.breadcrumb,
        active: createUserMeta.active ?? true,
        content: <CreateUserContent />,
      },
      'Modify User': {
        title: modifyUserMeta.title,
        breadcrumb: modifyUserMeta.breadcrumb,
        active: modifyUserMeta.active ?? true,
        content: <ModifyUserContent />,
      },
    }),
    []
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

        <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 md:px-8">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
    </div>
  );
}
