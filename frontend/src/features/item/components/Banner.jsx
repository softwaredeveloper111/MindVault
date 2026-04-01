export default function Banner() {
  return (
    <div className="sticky top-0 z-50 bg-purple-500/10 border-b border-purple-500/20 px-10 py-3 flex justify-between">
      
      <p className="text-sm text-purple-300">
        🧠 From your memory — 2 months ago you saved:
        <span className="font-bold underline ml-1">
          The Architecture of Complexity
        </span>
      </p>

      <button className="bg-purple-500 px-4 py-1 rounded-full text-xs font-bold">
        View
      </button>
    </div>
  );
}