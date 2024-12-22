import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DomainList from '@/components/DomainList';
import OfferForm from '@/components/OfferForm';
import Footer from '@/components/Footer';
import FeaturedDomains from '@/components/FeaturedDomains';
import ContactForm from '@/components/ContactForm';
import { useToast } from '@/hooks/use-toast';
import { Search, Sparkles, Globe2, Rocket, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<{ name: string; price: number } | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

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

  const handleMakeOffer = (domain: { name: string; price: number }) => {
    setSelectedDomain(domain);
    setIsOfferFormOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "搜索中",
      description: `正在搜索: ${searchQuery}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-gradient" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              {siteSettings?.hero_title || '寻找完美的域名'}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              {siteSettings?.hero_subtitle || '探索精选优质域名，为您的数字未来打造完美起点'}
            </p>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    className="w-full pl-11 pr-4 py-6 text-lg bg-white/10 border-gray-700 text-white placeholder-gray-400 backdrop-blur-lg"
                    placeholder="搜索域名..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                >
                  搜索
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <FeaturedDomains onMakeOffer={handleMakeOffer} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-lg border border-purple-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">精品域名</h3>
            </div>
            <p className="text-gray-300">发现市场上最受欢迎的优质域名资源</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-lg border border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Globe2 className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">全球域名</h3>
            </div>
            <p className="text-gray-300">覆盖全球的域名交易网络</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-lg border border-pink-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="h-6 w-6 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">快速部署</h3>
            </div>
            <p className="text-gray-300">便捷的域名转移和部署服务</p>
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            可用域名
          </h2>
          <DomainList onMakeOffer={handleMakeOffer} />
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

      <OfferForm
        isOpen={isOfferFormOpen}
        onClose={() => setIsOfferFormOpen(false)}
        selectedDomain={selectedDomain}
      />

      <Footer />
    </div>
  );
};

export default Index;
