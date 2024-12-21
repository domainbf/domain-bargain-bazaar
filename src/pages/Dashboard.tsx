import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, DollarSign, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userDomains } = useQuery({
    queryKey: ['user-domains'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('owner_id', session.user.id);
      
      if (error) throw error;
      return data;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "已退出登录",
      description: "期待您的再次访问！",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">用户中心</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">我的域名</p>
                <p className="text-2xl font-bold">{userDomains?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总价值</p>
                <p className="text-2xl font-bold">
                  ${userDomains?.reduce((sum, domain) => sum + Number(domain.price), 0).toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">账户状态</p>
                <p className="text-2xl font-bold">正常</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">我的域名</h2>
            <div className="space-y-4">
              {userDomains?.map((domain) => (
                <Card key={domain.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{domain.name}</h3>
                      <p className="text-sm text-gray-500">{domain.status}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      ${Number(domain.price).toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}
              {(!userDomains || userDomains.length === 0) && (
                <p className="text-gray-500 text-center py-8">暂无域名</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">个人资料</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">用户名</label>
                  <p className="font-medium">{profile?.username || '未设置'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">姓名</label>
                  <p className="font-medium">{profile?.full_name || '未设置'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">简介</label>
                  <p className="font-medium">{profile?.bio || '未设置'}</p>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/profile/edit')}
                >
                  编辑资料
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;