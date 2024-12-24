import React from 'react';
import Navigation from '@/components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Grid, Globe, Building2, Briefcase, Star } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('category, count(*)')
        .eq('status', 'available')
        .group('category');
      
      if (error) throw error;
      return data;
    }
  });

  const categories = [
    {
      id: 'premium',
      name: '高级域名',
      description: '精选优质域名，适合高端品牌和企业使用',
      icon: Star,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'business',
      name: '商业域名',
      description: '适合企业和商业用途的专业域名',
      icon: Building2,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'standard',
      name: '标准域名',
      description: '性价比高的通用域名',
      icon: Globe,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const getCount = (category: string) => {
    const found = categoryCounts?.find(c => c.category === category);
    return found?.count || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <Grid className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-bold text-white">域名分类</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-6 bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/30">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">
                        {category.name}
                      </h2>
                    </div>
                    
                    <p className="text-gray-300 min-h-[3rem]">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        可用域名：{getCount(category.id)}
                      </span>
                      <Button
                        onClick={() => navigate(`/domains?category=${category.id}`)}
                        className={`bg-gradient-to-r ${category.color} text-white hover:opacity-90`}
                      >
                        查看域名
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Categories;