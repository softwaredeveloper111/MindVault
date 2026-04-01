
import AuthCard from "../components/LoginAuthCard";
import Footer from "../components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background blur */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-400/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
            📦
          </div>
          <h1 className="text-4xl font-bold text-blue-300">MindVault</h1>
          <p className="text-gray-400 mt-2">
            Save anything. Remember everything.
          </p>
        </div>

        <AuthCard />
        <Footer />
      </div>
    </div>
  );
}