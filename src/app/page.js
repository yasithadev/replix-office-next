"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

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

const Icons = {
  Home: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Analytics: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </svg>
  ),
  Projects: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18m-18 0V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25V13.5m-18 0V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.5" />
    </svg>
  ),
  Settings: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  Notifications: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  ),
  Menu: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  Close: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  Search: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
    </svg>
  ),
};

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

  const menuItems = useMemo(
    () => [
      { name: 'Home', icon: Icons.Home },
      { name: 'Analytics', icon: Icons.Analytics },
      { name: 'Projects', icon: Icons.Projects },
      { name: 'Settings', icon: Icons.Settings },
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
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
            aria-label="Toggle Sidebar"
          >
            <Icons.Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-md shadow-indigo-100">N</span>
            <span className="hidden text-xl font-bold tracking-tight text-slate-900 sm:block">NextLayout</span>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 px-8 sm:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Icons.Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-indigo-600"></span>
            <Icons.Notifications className="h-6 w-6" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                alt="Profile Avatar"
                className="h-9 w-9 rounded-full border border-slate-100 object-cover shadow-sm"
              />
              <span className="hidden text-sm font-medium text-slate-700 md:block">Sarah Connor</span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                <div className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">My Account</div>
                  <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Profile Settings</button>
                  <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Billing</button>
                  <hr className="my-1 border-slate-100" />
                  <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`fixed bottom-0 left-0 top-0 z-50 w-64 border-r border-slate-200 bg-white p-4 transition-transform duration-300 ease-in-out md:sticky md:top-16 md:z-30 md:h-[calc(100vh-4rem)] md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between md:hidden">
            <span className="font-bold text-slate-900">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
            >
              <Icons.Close className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveItem(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

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
