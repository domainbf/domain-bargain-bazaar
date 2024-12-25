import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Globe, DollarSign } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: string;
}

interface ScrollingDomainsProps {
  direction?: 'left' | 'right';
  status?: string;
  className?: string;
}

const ScrollingDomains = ({ direction = 'left', status = 'available', className = '' }: ScrollingDomainsProps) => {
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Domain[];
    }
  });

  if (isLoading || !domains?.length) return null;

  // Duplicate domains for seamless scrolling
  const scrollContent = [...domains, ...domains];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="inline-block"
      >
        {scrollContent.map((domain, index) => (
          <div
            key={`${domain.id}-${index}`}
            className="inline-block px-2"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-72">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">{domain.name}</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {status === 'sold' ? '已售出' : '一口价'}
                </Badge>
              </div>
              <div className="flex items-center text-green-400">
                <DollarSign className="h-4 w-4" />
                <span className="font-bold">{domain.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingDomains;