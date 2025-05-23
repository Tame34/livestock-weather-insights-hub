
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LivestockProvider } from "@/contexts/LivestockContext";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Router>
      <LivestockProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LivestockProvider>
      <Toaster />
    </Router>
  );
};

export default App;
