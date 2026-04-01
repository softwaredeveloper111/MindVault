import Loader from "./Loader";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-50 w-full h-screen bg-zinc-900 flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default LoadingPage;