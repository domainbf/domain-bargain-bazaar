import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Globe2, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(10);
      
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
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="inline-block"
      >
        {scrollContent.map((domain, index) => (
          <div
            key={`${domain.id}-${index}`}
            className="inline-block px-2"
            onClick={() => navigate(`/domains/${domain.id}`)}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-72 cursor-pointer hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">{domain.name}</span>
                </div>
                <div className="flex items-center text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-bold">{domain.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingDomains;