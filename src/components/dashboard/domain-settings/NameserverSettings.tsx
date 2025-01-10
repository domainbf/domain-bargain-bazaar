import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LoadingState } from '@/components/ui/loading-state';

interface NameserverSettingsProps {
  domainId: string;
}

const NameserverSettings: React.FC<NameserverSettingsProps> = ({ domainId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nameservers, setNameservers] = React.useState(['', '', '', '']);

  const { data: currentNameservers, isLoading } = useQuery({
    queryKey: ['nameservers', domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('nameservers')
        .eq('id', domainId)
        .single();
      
      if (error) throw error;
      return data.nameservers || [];
    },
    onSuccess: (data) => {
      setNameservers(data.length ? data : ['', '', '', '']);
    }
  });

  const updateNameservers = useMutation({
    mutationFn: async (newNameservers: string[]) => {
      const { error } = await supabase
        .from('domains')
        .update({ nameservers: newNameservers.filter(ns => ns.trim()) })
        .eq('id', domainId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nameservers', domainId] });
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

  if (isLoading) {
    return <LoadingState message="加载域名服务器设置..." />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {nameservers.map((ns, index) => (
          <Input
            key={index}
            placeholder={`域名服务器 ${index + 1}`}
            value={ns}
            onChange={(e) => {
              const newNameservers = [...nameservers];
              newNameservers[index] = e.target.value;
              setNameservers(newNameservers);
            }}
          />
        ))}
      </div>

      <Button
        onClick={() => updateNameservers.mutate(nameservers)}
        disabled={updateNameservers.isPending}
        className="w-full"
      >
        保存设置
      </Button>

      <div className="text-sm text-gray-400">
        <p>提示：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>至少需要设置2个域名服务器</li>
          <li>域名服务器更新可能需要24-48小时生效</li>
          <li>更改域名服务器可能会影响域名解析</li>
        </ul>
      </div>
    </div>
  );
};

export default NameserverSettings;