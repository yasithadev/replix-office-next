'use client';

export default function DashboardSection() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">$45,231.89</div>
          <div className="mt-1 text-xs font-semibold text-emerald-600">↑ +20.1% from last month</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Users</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">+2,350</div>
          <div className="mt-1 text-xs font-semibold text-emerald-600">↑ +180.1% from last month</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversion Rate</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">12.24%</div>
          <div className="mt-1 text-xs font-semibold text-red-600">↓ -4.1% from last week</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Performance</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">99.2%</div>
          <div className="mt-1 text-xs font-semibold text-emerald-600">↑ +1.2% this sprint</div>
        </div>
      </div>
    </div>
  );
}
