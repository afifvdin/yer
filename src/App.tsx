import { Home } from "./_components/home/home";
import { Navbar } from "./_components/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { Uploader } from "./_components/uploader";
import { useStore } from "./stores/use-store";

function App() {
  const sentencesLength = useStore((state) => state.getSentencesLength());
  return (
    <div className="bg-background h-full font-sans text-sm tracking-tight">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        {sentencesLength > 0 ? (
          <>
            <Navbar />
            <Home />
          </>
        ) : (
          <Uploader />
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
