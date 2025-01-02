import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  status: string;
  is_featured: boolean;
}

export function useFeaturedDomains() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['featured-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .eq('is_featured', true)
        .order('price', { ascending: false });
      
      if (error) {
        toast({
          title: "错误提示",
          description: "无法加载精选域名",
          variant: "destructive",
        });
        throw error;
      }
      return data as Domain[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}