import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import PlatformSetup from "./pages/PlatformSetup";
import RegisterInstitution from "./pages/RegisterInstitution";
import VerifyInstitution from "./pages/VerifyInstitution";
import IssueCertificate from "./pages/IssueCertificate";
import VerifyCertificate from "./pages/VerifyCertificate";
import Certificates from "./pages/Certificates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/platform" element={<PlatformSetup />} />
              <Route path="/institution/register" element={<RegisterInstitution />} />
              <Route path="/institution/verify" element={<VerifyInstitution />} />
              <Route path="/certificate/issue" element={<IssueCertificate />} />
              <Route path="/certificate/verify" element={<VerifyCertificate />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </WalletContextProvider>
  </QueryClientProvider>
);

export default App;
