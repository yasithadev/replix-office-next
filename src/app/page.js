"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';

const DashboardSection = dynamic(() => import('./components/sections/DashboardSection'), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard…</div>,
});

const AnalyticsSection = dynamic(() => import('./components/sections/AnalyticsSection'), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading analytics…</div>,
});

const ProjectsSection = dynamic(() => import('./components/sections/ProjectsSection'), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading projects…</div>,
});

const SettingsSection = dynamic(() => import('./components/sections/SettingsSection'), {
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
      Home: '',
      Analytics: 'analytics',
      Projects: 'projects',
      Settings: 'settings',
    }),
    []
  );

  const hashToSection = useMemo(
    () => Object.fromEntries(Object.entries(sectionToHash).filter(([, hash]) => hash).map(([section, hash]) => [hash, section])),
    [sectionToHash]
  );

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    setActiveItem(hash && hashToSection[hash] ? hashToSection[hash] : 'Home');
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
      setActiveItem(hash && hashToSection[hash] ? hashToSection[hash] : 'Home');
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
    ],
    []
  );

  const contentMap = useMemo(
    () => ({
      Home: <DashboardSection />,
      Analytics: <AnalyticsSection />,
      Projects: <ProjectsSection />,
      Settings: <SettingsSection />,
    }),
    []
  );

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
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <span>Dashboard</span>
                <span>/</span>
                <span className="font-semibold text-indigo-600">{activeItem}</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">{activeItem} Dashboard</h1>
            </div>
          </div>

          <div className="min-h-[300px]">{contentMap[activeItem]}</div>
        </main>
      </div>
    </div>
  );
}
