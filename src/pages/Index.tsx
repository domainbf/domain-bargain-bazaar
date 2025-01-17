import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/home/HeroSection';
import TrendingDomains from '@/components/home/TrendingDomains';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import ScrollingDomains from '@/components/home/ScrollingDomains';
import ContactForm from '@/components/ContactForm';
import FeaturedDomains from '@/components/FeaturedDomains';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ListPlus } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a] flex items-center justify-center">
      <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
};

const IndexContent = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Session fetch error:', error);
        toast({
          title: "Error loading session",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error loading profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    }
  });

  const { data: siteSettings, error: settingsError } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');
        
        if (error) {
          console.error('Error fetching site settings:', error);
          toast({
            title: "加载设置失败",
            description: "无法加载网站设置，使用默认配置",
            variant: "destructive",
          });
          return {};
        }
        return Object.fromEntries(data.map(item => [item.key, item.value]));
      } catch (err) {
        console.error('Error in site settings query:', err);
        return {};
      }
    },
    retry: 1,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {session && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              我的域名
            </Button>
            
            {profile?.is_seller && (
              <Button
                onClick={() => navigate('/domains/new')}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ListPlus className="mr-2 h-5 w-5" />
                出售域名
              </Button>
            )}
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            精选域名
          </h2>
          <FeaturedDomains />
        </div>
        
        <FeaturesGrid />

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            一口价域名
          </h2>
          <ScrollingDomains direction="left" status="available" className="mb-8" />
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            最近售出
          </h2>
          <ScrollingDomains direction="right" status="sold" className="mb-8" />
        </div>

        <div className="mb-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center gap-2">
              <MessageSquare className="h-8 w-8" />
              联系我们
            </h2>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <IndexContent />
    </ErrorBoundary>
  );
};

export default Index;
