import { Construction } from "lucide-react";

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8 bg-white/50 rounded-[2rem]">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Construction size={40} className="text-orange-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">{title} is Coming Soon!</h1>
      <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
        {description || "We are working hard to bring this feature to you. Stay tuned for exciting updates!"}
      </p>
    </div>
  );
}
