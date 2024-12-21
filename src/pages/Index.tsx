import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DomainList from '@/components/DomainList';
import OfferForm from '@/components/OfferForm';
import Footer from '@/components/Footer';
import FeaturedDomains from '@/components/FeaturedDomains';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, DollarSign, Star, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<{ name: string; price: number } | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
      <Navigation />
      
      <header className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              寻找完美的域名
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              浏览我们精心挑选的优质域名，为您的数字身份找到最佳选择。
            </p>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10 pr-3 py-6 text-lg"
                    placeholder="搜索域名..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                  搜索
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <FeaturedDomains onMakeOffer={handleMakeOffer} />
        
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold">热门域名</h3>
              </div>
              <p className="text-gray-600">发现市场上最受欢迎的域名。</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold">特价优惠</h3>
              </div>
              <p className="text-gray-600">限时优惠的高级域名。</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold">精选域名</h3>
              </div>
              <p className="text-gray-600">为您的业务精心挑选的优质域名。</p>
            </motion.div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">可用域名</h2>
          <DomainList onMakeOffer={handleMakeOffer} />
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