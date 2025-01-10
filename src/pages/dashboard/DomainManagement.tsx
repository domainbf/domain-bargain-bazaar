import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, Settings, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import DomainSettings from '@/components/dashboard/DomainSettings';

const DomainManagement = () => {
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);

  const { data: domains, isLoading, error, refetch } = useQuery({
    queryKey: ['user-domains'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('未登录');

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <LoadingState message="加载域名列表中..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="加载域名失败" 
        onRetry={() => refetch()}
      />
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300">使用中</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300">待处理</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/20 text-red-300">已过期</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300">可用</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">我的域名</h2>
        <Button variant="outline" onClick={() => window.location.href = '/domains'}>
          浏览更多域名
        </Button>
      </div>

      <div className="grid gap-4">
        {domains?.map((domain) => (
          <Card key={domain.id} className="p-6 bg-gray-800/50 border-white/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-white">{domain.name}</h3>
                  {getStatusBadge(domain.status)}
                </div>
                <p className="text-sm text-gray-400">
                  注册时间: {new Date(domain.created_at).toLocaleDateString()}
                </p>
                <p className="text-lg font-semibold text-green-400">
                  {formatCurrency(domain.price)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://${domain.name}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  访问
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {domains?.length === 0 && (
          <Card className="p-6 text-center bg-gray-800/50 border-white/10">
            <p className="text-gray-400">您还没有任何域名</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/domains'}
            >
              浏览域名
            </Button>
          </Card>
        )}
      </div>

      <DomainSettings
        domainId={selectedDomain}
        onClose={() => setSelectedDomain(null)}
      />
    </div>
  );
};

export default DomainManagement;