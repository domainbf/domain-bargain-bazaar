import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const OfferList = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['my-offers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('domain_offers')
        .select(`
          *,
          domain:domains(*)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-white/60">加载中...</div>;
  }

  if (!offers?.length) {
    return <div className="text-white/60">暂无报价记录</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-500/20 text-green-300">已接受</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300">已拒绝</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-300">等待回复</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <div 
          key={offer.id} 
          className="flex justify-between items-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <div>
            <h3 className="text-white font-medium">{offer.domain.name}</h3>
            <p className="text-sm text-white/60">
              报价日期: {format(new Date(offer.created_at), 'yyyy-MM-dd')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">${offer.amount}</p>
            {getStatusBadge(offer.status)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfferList;