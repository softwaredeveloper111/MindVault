export default function Topbar() {
  return (
    <header className="sticky top-[49px] z-40 h-20 flex items-center justify-between px-10 bg-[#0b1326]/80 backdrop-blur">

      <input
        placeholder="Search your mind..."
        className="w-[400px] bg-[#2d3449] rounded-full px-4 py-2 text-sm outline-none"
      />

      <div className="flex gap-6 text-xs uppercase">
        <span className="text-blue-400 border-b border-blue-400">All</span>
        <span className="text-gray-400">Articles</span>
        <span className="text-gray-400">Tweets</span>
        <span className="text-gray-400">YouTube</span>
      </div>
    </header>
  );
}