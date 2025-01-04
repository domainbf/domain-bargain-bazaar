import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DomainSalesList = () => {
  const navigate = useNavigate();
  const { data: domains, isLoading } = useQuery({
    queryKey: ['my-domains'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-white/60">加载中...</div>;
  }

  if (!domains?.length) {
    return <div className="text-white/60">暂无域名</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return <Badge className="bg-green-500/20 text-green-300">已售出</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-500/20 text-yellow-300">已预订</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300">可购买</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {domains.map((domain) => (
        <div 
          key={domain.id} 
          className="flex justify-between items-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <div>
            <h3 className="text-white font-medium">{domain.name}</h3>
            <p className="text-sm text-white/60">
              价格: ${domain.price}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(domain.status)}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/60 hover:text-white"
              onClick={() => navigate(`/domains/${domain.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/60 hover:text-white"
              onClick={() => navigate(`/domains/${domain.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DomainSalesList;