import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative bg-gradient-to-b from-blue-600 to-blue-800 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-lg text-white mb-8">
          {t('hero.description')}
        </p>
        <div className="flex justify-center">
          <Input
            type="text"
            placeholder={t('hero.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md rounded-l-md"
          />
          <Button className="bg-blue-500 text-white rounded-r-md">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;