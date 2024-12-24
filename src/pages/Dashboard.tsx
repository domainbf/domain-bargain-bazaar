import React from 'react';
import Navigation from '@/components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { data: purchasedDomains, isLoading } = useQuery({
    queryKey: ['purchased-domains'],
    queryFn: async () => {
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select(`
          *,
          domain:domains(*)
        `)
        .eq('status', 'completed');

      if (transactionError) throw transactionError;
      return transactions;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">我的域名</h1>
        
        {isLoading ? (
          <div>加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedDomains?.map((transaction) => (
              <Card key={transaction.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{transaction.domain.name}</h3>
                    <p className="text-sm text-gray-500">{transaction.domain.description}</p>
                  </div>
                  <Badge>已购买</Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    购买日期: {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    支付金额: ${transaction.amount}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;