import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Settings, Activity, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DNSSettings from '@/components/dashboard/domain-settings/DNSSettings';
import { useTranslation } from '@/hooks/useTranslation';

interface Domain {
  id: string;
  name: string;
  status: string;
  registration_date: string;
  expiry_date: string;
  price: number;
}

const DomainManagementPanel = () => {
  const { t } = useTranslation();
  
  const { data: domains, isLoading } = useQuery({
    queryKey: ['user-domains'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      return data as Domain[];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">{t('domain.status.active')}</Badge>;
      case 'expired':
        return <Badge variant="destructive">{t('domain.status.expired')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">{t('domain.status.pending')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">域名管理</h2>
        <Button variant="outline" onClick={() => window.location.href = '/domains'}>
          浏览更多域名
        </Button>
      </div>

      {domains?.map((domain) => (
        <Card key={domain.id} className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <span className="text-white">{domain.name}</span>
              {getStatusBadge(domain.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-gray-700/50">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="dns">DNS 设置</TabsTrigger>
                <TabsTrigger value="analytics">统计</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">注册日期</div>
                    <div className="text-white">
                      {new Date(domain.registration_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">到期日期</div>
                    <div className="text-white">
                      {new Date(domain.expiry_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">当前价值</div>
                    <div className="text-green-400 font-bold">
                      ${domain.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dns">
                <DNSSettings domainId={domain.id} />
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="p-4 text-center text-gray-400">
                  域名访问统计功能即将上线
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}

      {(!domains || domains.length === 0) && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 mb-4">您还没有任何域名</p>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/domains'}
            >
              浏览域名
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainManagementPanel;