import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Banner from "../components/Banner";
import MasonryGrid from "../components/MasonryGrid";

export default function Dashboard() {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen">
      <Sidebar />

      <div className="ml-[260px]">
        <Banner />
        <Topbar />

        <main className="p-10 pt-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Recent Fragments</h1>
            <p className="text-xs text-gray-400">Sorted by Relevance</p>
          </div>

          <MasonryGrid />
        </main>
      </div>
    </div>
  );
}