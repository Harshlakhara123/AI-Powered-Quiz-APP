export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Your assignments
      </h1>
      <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">
        This is your dashboard. As you create assignments, they&apos;ll appear
        here along with their status and AI-generated insights.
      </p>
    </div>
  );
}

