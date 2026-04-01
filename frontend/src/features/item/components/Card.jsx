export default function Card({ item }) {
  return (
    <div className="bg-[#222a3d] rounded-xl overflow-hidden hover:scale-[1.02] transition cursor-pointer mb-6 break-inside-avoid">
      
      {item.image && (
        <img src={item.image} className="h-48 w-full object-cover" />
      )}

      <div className="p-5 space-y-2">
        <h3 className="font-bold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-400">{item.desc}</p>

        <div className="flex gap-2 flex-wrap">
          {item.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}