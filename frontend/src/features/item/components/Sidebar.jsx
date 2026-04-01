export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#131b2e] p-6 flex flex-col justify-between">
      
      <div>
        <h1 className="text-2xl font-bold text-blue-300 mb-6">MindVault</h1>

        <button className="w-full bg-blue-500 text-black font-bold py-2 rounded-xl mb-6">
          + Add New
        </button>

        <nav className="space-y-3 text-sm">
          <p className="text-blue-400 font-bold">All Items</p>
          <p className="text-gray-400">Favorites</p>
          <p className="text-gray-400">Archived</p>
        </nav>
      </div>

      <div className="text-sm">
        <p className="text-gray-300">Alex Rivera</p>
        <p className="text-gray-500 text-xs">Pro Curator</p>
      </div>
    </aside>
  );
}