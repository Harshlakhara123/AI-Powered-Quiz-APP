export default function Dashboard() {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Control Panel</h2>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <ul className="space-y-4">
          <li className="p-4 bg-gray-50 rounded-xl text-base font-semibold text-black border border-gray-100 shadow-inner">Activity Log</li>
          <li className="p-4 bg-gray-50 rounded-xl text-base font-semibold text-black border border-gray-100 shadow-inner">User Settings</li>
          <li className="p-4 bg-gray-50 rounded-xl text-base font-semibold text-black border border-gray-100 shadow-inner">Analytics</li>
        </ul>
      </div>
    </div>
  );
}