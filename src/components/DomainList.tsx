import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Globe, DollarSign, Clock, Search, Filter } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'sold';
  description: string;
  category: string;
}

const DomainList = ({ onMakeOffer }: { onMakeOffer: (domain: Domain) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');

  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', categoryFilter, priceSort],
    queryFn: async () => {
      let query = supabase
        .from('domains')
        .select('*')
        .eq('status', 'available');
      
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      query = query.order('price', { ascending: priceSort === 'asc' });
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Domain[];
    }
  });

  const filteredDomains = domains?.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索域名或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="选择类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类别</SelectItem>
              <SelectItem value="premium">高级域名</SelectItem>
              <SelectItem value="standard">标准域名</SelectItem>
              <SelectItem value="business">商业域名</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceSort} onValueChange={(value: 'asc' | 'desc') => setPriceSort(value)}>
            <SelectTrigger className="w-[180px]">
              <DollarSign className="h-4 w-4 mr-2" />
              <SelectValue placeholder="价格排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">价格从低到高</SelectItem>
              <SelectItem value="desc">价格从高到低</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains?.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    {domain.name}
                  </h3>
                </div>
                <p className="text-gray-100 text-sm min-h-[3rem] bg-black/30 p-2 rounded-md">
                  {domain.description}
                </p>
                <div className="flex items-center justify-between bg-black/30 p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-xl font-bold text-white">
                      ${domain.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-200 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    新上架
                  </div>
                </div>
                <Button 
                  onClick={() => onMakeOffer(domain)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold"
                >
                  立即购买
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DomainList;