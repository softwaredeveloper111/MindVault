import AuthCard from "../components/RegisterAuthCard";
import Footer from "../components/Footer";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col justify-between relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-400/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="flex-grow flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-[460px]">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
              ✨
            </div>
            <h1 className="text-4xl font-bold text-blue-300">MindVault</h1>
            <p className="text-gray-400 mt-2">
              Save anything. Remember everything.
            </p>
          </div>

          <AuthCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}