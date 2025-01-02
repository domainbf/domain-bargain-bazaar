import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string | null;
  status: string | null;
}

export const useDomains = (category?: string | null) => {
  return useQuery({
    queryKey: ['domains', category],
    queryFn: async () => {
      let query = supabase
        .from('domains')
        .select('*')
        .eq('status', 'available');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Domain[];
    }
  });
};