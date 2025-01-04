import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const PurchaseHistory = () => {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          domain:domains(*)
        `)
        .eq('buyer_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-white/60">加载中...</div>;
  }

  if (!purchases?.length) {
    return <div className="text-white/60">暂无购买记录</div>;
  }

  return (
    <div className="space-y-4">
      {purchases.map((transaction) => (
        <div 
          key={transaction.id} 
          className="flex justify-between items-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <div>
            <h3 className="text-white font-medium">{transaction.domain.name}</h3>
            <p className="text-sm text-white/60">
              购买日期: {format(new Date(transaction.created_at), 'yyyy-MM-dd')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">${transaction.amount}</p>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              已完成
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseHistory;