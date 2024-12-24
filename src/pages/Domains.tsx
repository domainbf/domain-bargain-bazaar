import React from 'react';
import Navigation from '@/components/Navigation';
import DomainList from '@/components/DomainList';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Domains = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={() => navigate('/categories')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回分类
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {category ? `${category === 'premium' ? '高级' : category === 'business' ? '商业' : '标准'}域名` : '所有域名'}
          </h1>
        </div>

        <DomainList onMakeOffer={() => {}} />
      </main>
    </div>
  );
};

export default Domains;