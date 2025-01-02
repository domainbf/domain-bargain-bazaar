import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: string;
}

export const useScrollingDomains = (status: string = 'available') => {
  return useQuery({
    queryKey: ['scrolling-domains', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Domain[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};