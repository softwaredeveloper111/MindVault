import Card from "./Card";

const data = [
  {
    title: "Future of Decentralized Identity",
    desc: "Web3 identity system...",
    image: "https://source.unsplash.com/random/1",
    tags: ["Web3", "Privacy"],
  },
  {
    title: "10 Design Principles",
    desc: "Spatial computing design...",
    image: "https://source.unsplash.com/random/2",
    tags: ["UI"],
  },
  {
    title: "Economic Trends 2024",
    desc: "AI economy shift...",
    image: null,
    tags: ["Economics"],
  },
];

export default function MasonryGrid() {
  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
      {data.map((item, i) => (
        <Card key={i} item={item} />
      ))}
    </div>
  );
}