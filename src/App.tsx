import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import StaticPage from "./pages/StaticPage";
import Categories from "./pages/Categories";
import Domains from "./pages/Domains";
import AboutPage from "./pages/StaticPage/About";
import HelpPage from "./pages/StaticPage/Help";
import CompanyIntro from "./pages/StaticPage/About/CompanyIntro";
import JoinUs from "./pages/StaticPage/About/JoinUs";
import Contact from "./pages/StaticPage/About/Contact";
import News from "./pages/StaticPage/Help/News";
import Guide from "./pages/StaticPage/Help/Guide";
import FAQ from "./pages/StaticPage/Help/FAQ";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // 窗口重新获得焦点时重新获取数据
      refetchOnMount: true,      // 组件挂载时重新获取数据
      refetchInterval: 30000,    // 每30秒自动刷新一次数据
      staleTime: 10000,         // 数据10秒后视为过期
    },
  },
});

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/domains" element={<Domains />} />
          
          {/* 静态页面路由 */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about/company" element={<CompanyIntro />} />
          <Route path="/about/join" element={<JoinUs />} />
          <Route path="/about/contact" element={<Contact />} />
          <Route path="/help/news" element={<News />} />
          <Route path="/help/guide" element={<Guide />} />
          <Route path="/help/faq" element={<FAQ />} />
          
          {/* 通用静态页面路由 */}
          <Route path="/page/:slug" element={<StaticPage />} />
          
          {/* 404页面重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;