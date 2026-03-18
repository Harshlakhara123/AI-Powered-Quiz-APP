export default function Home() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">Main Workspace</h1>
      <p className="text-gray-500 max-w-md">
        This area remains centered. On desktop, the dashboard is visible on the right. 
        On mobile, use the top-right button to toggle it.
      </p>
      
      <div className="flex gap-4 justify-center">
        <button className="px-6 py-3 bg-white border text-black border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
          Primary Action
        </button>
        <button className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-semibold">
          Secondary Action
        </button>
      </div>
    </div>
  );
}