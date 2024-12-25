import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaticPage from "./pages/StaticPage";
import Categories from "./pages/Categories";
import Domains from "./pages/Domains";
import AboutPage from "./pages/StaticPage/About";
import HelpPage from "./pages/StaticPage/Help";
import CompanyIntro from "./pages/StaticPage/About/CompanyIntro";
import JoinUs from "./pages/StaticPage/About/JoinUs";
import Contact from "./pages/StaticPage/About/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/page/:slug" element={<StaticPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about/company" element={<CompanyIntro />} />
          <Route path="/about/join" element={<JoinUs />} />
          <Route path="/about/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;