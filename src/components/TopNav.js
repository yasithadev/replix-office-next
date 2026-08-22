"use client";

import React from 'react';

const Icons = {
  Menu: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  Notifications: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  ),
  Search: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
    </svg>
  ),
};

export default function TopNav({ onToggleSidebar, profileOpen, onToggleProfile, searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            onChange={onSearchChange}
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
            onClick={onToggleProfile}
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
              <div className="fixed inset-0 z-40" onClick={onToggleProfile}></div>
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
  );
}