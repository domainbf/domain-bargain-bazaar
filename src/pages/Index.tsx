import React from 'react';
import Navigation from '@/components/Navigation';
import DomainList from '@/components/DomainList';
import Footer from '@/components/Footer';
import FeaturedDomains from '@/components/FeaturedDomains';
import ContactForm from '@/components/ContactForm';
import { MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/home/HeroSection';
import TrendingDomains from '@/components/home/TrendingDomains';
import FeaturesGrid from '@/components/home/FeaturesGrid';

const Index = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return Object.fromEntries(data.map(item => [item.key, item.value]));
    }
  });

  const { data: trendingDomains } = useQuery({
    queryKey: ['trending-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      
      <HeroSection 
        siteSettings={siteSettings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <TrendingDomains domains={trendingDomains} />

      <main className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <FeaturedDomains />
        </div>
        
        <FeaturesGrid />

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            可用域名
          </h2>
          <DomainList />
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

export default Index;