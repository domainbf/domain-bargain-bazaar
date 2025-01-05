import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  siteSettings?: Record<string, any>;
}

const HeroSection = ({ searchQuery, setSearchQuery, siteSettings }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-b from-blue-600 to-blue-800 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          {siteSettings?.hero_title || "寻找您的理想域名"}
        </h1>
        <p className="text-lg text-white mb-8">
          {siteSettings?.hero_description || "探索我们的精选域名，轻松找到适合您的业务。"}
        </p>
        <div className="flex justify-center">
          <Input
            type="text"
            placeholder="输入域名..."
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
