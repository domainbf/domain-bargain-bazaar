import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('searching'),
      description: `${t('searching_for')}: ${searchQuery}`,
    });
  };

  return (
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
            {t('hero_title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            {t('hero_subtitle')}
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
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                {t('search')}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;