import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Globe, DollarSign, Clock } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'sold';
  description: string;
}

const DomainList = ({ onMakeOffer }: { onMakeOffer: (domain: Domain) => void }) => {
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Domain[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {domains?.map((domain, index) => (
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
  );
};

export default DomainList;