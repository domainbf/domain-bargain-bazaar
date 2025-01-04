import React from 'react';
import Navigation from '@/components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, DollarSign, ListPlus } from 'lucide-react';
import OfferList from '@/components/dashboard/OfferList';
import DomainSalesList from '@/components/dashboard/DomainSalesList';
import PurchaseHistory from '@/components/dashboard/PurchaseHistory';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">用户中心</h1>
          {profile?.is_seller && (
            <Button 
              onClick={() => navigate('/domains/new')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500"
            >
              <ListPlus className="mr-2 h-4 w-4" />
              添加域名
            </Button>
          )}
        </div>

        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="bg-white/10 text-white">
            <TabsTrigger value="purchases" className="data-[state=active]:bg-white/20">
              <ShoppingCart className="mr-2 h-4 w-4" />
              我的购买
            </TabsTrigger>
            {profile?.is_seller && (
              <TabsTrigger value="sales" className="data-[state=active]:bg-white/20">
                <DollarSign className="mr-2 h-4 w-4" />
                我的销售
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">购买历史</h2>
              <PurchaseHistory />
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">我的报价</h2>
              <OfferList />
            </Card>
          </TabsContent>

          {profile?.is_seller && (
            <TabsContent value="sales" className="space-y-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">我的域名</h2>
                <DomainSalesList />
              </Card>
            </Card>
          </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;