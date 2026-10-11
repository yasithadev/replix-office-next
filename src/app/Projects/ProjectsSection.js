'use client';

export const pageMeta = {
  title: 'Projects Dashboard',
  breadcrumb: ['Dashboard', 'Projects'],
};

export default function ProjectsSection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Projects overview</h2>
      <p className="mt-2 text-sm text-slate-500">Use this section to show cards, filters, and task progress.</p>
    </div>
  );
}
