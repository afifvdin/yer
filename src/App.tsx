import { Home } from "./_components/home/home";
import { Navbar } from "./_components/navbar/navbar";
import { Toaster } from "./components/ui/sonner";
import { Uploader } from "./_components/uploader";
import { useStore } from "./stores/use-store";

function App() {
  const sentencesLength = useStore((state) => state.getSentencesLength());
  return (
    <div className="bg-background h-full font-sans text-sm tracking-tight">
      <Toaster />
      {sentencesLength > 0 ? (
        <>
          <Navbar />
          <Home />
        </>
      ) : (
        <Uploader />
      )}
    </div>
  );
}

export default App;
