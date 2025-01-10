import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface NameserverSettings {
  id: string;
  domain_id: string;
  ns1?: string;
  ns2?: string;
  ns3?: string;
  ns4?: string;
}

const NameserverSettings = ({ domainId }: { domainId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['nameserver-settings', domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nameserver_settings')
        .select('*')
        .eq('domain_id', domainId)
        .single();
      
      if (error) throw error;
      return data as NameserverSettings;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newSettings: Partial<NameserverSettings>) => {
      const { error } = await supabase
        .from('nameserver_settings')
        .update(newSettings)
        .eq('domain_id', domainId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nameserver-settings', domainId] });
      toast({
        title: "更新成功",
        description: "域名服务器设置已更新",
      });
    },
    onError: (error) => {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateMutation.mutate({
      ns1: formData.get('ns1') as string,
      ns2: formData.get('ns2') as string,
      ns3: formData.get('ns3') as string,
      ns4: formData.get('ns4') as string,
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">加载中...</div>;
  }

  return (
    <Card className="p-6 bg-gray-900/50 border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">域名服务器设置</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="ns1" className="block text-sm font-medium text-gray-200">
              主域名服务器
            </label>
            <Input
              id="ns1"
              name="ns1"
              defaultValue={settings?.ns1}
              className="mt-1 bg-gray-800/50 border-white/10 text-white"
              placeholder="ns1.example.com"
            />
          </div>
          <div>
            <label htmlFor="ns2" className="block text-sm font-medium text-gray-200">
              辅助域名服务器 1
            </label>
            <Input
              id="ns2"
              name="ns2"
              defaultValue={settings?.ns2}
              className="mt-1 bg-gray-800/50 border-white/10 text-white"
              placeholder="ns2.example.com"
            />
          </div>
          <div>
            <label htmlFor="ns3" className="block text-sm font-medium text-gray-200">
              辅助域名服务器 2
            </label>
            <Input
              id="ns3"
              name="ns3"
              defaultValue={settings?.ns3}
              className="mt-1 bg-gray-800/50 border-white/10 text-white"
              placeholder="ns3.example.com"
            />
          </div>
          <div>
            <label htmlFor="ns4" className="block text-sm font-medium text-gray-200">
              辅助域名服务器 3
            </label>
            <Input
              id="ns4"
              name="ns4"
              defaultValue={settings?.ns4}
              className="mt-1 bg-gray-800/50 border-white/10 text-white"
              placeholder="ns4.example.com"
            />
          </div>
        </div>
        <Button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "更新中..." : "保存更改"}
        </Button>
      </form>
    </Card>
  );
};

export default NameserverSettings;