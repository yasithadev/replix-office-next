'use client';

export default function AnalyticsSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Weekly trend</h2>
        <p className="mt-2 text-sm text-slate-500">This section is mounted inside the shared shell and does not need to refetch the layout.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Audience reach</h2>
        <p className="mt-2 text-sm text-slate-500">Switching sections now only changes the content panel.</p>
      </div>
    </div>
  );
}
