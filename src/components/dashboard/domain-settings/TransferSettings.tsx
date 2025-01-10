import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Shield } from 'lucide-react';

interface TransferSettingsProps {
  domainId: string;
}

const TransferSettings: React.FC<TransferSettingsProps> = ({ domainId }) => {
  const { toast } = useToast();
  const [authCode, setAuthCode] = React.useState('');

  const { data: domain, isLoading } = useQuery({
    queryKey: ['domain-transfer', domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('transfer_lock, auth_code')
        .eq('id', domainId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const toggleTransferLock = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('domains')
        .update({ transfer_lock: !domain?.transfer_lock })
        .eq('id', domainId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: domain?.transfer_lock ? "转移锁已解除" : "转移锁已启用",
        description: domain?.transfer_lock ? 
          "域名现在可以转移" : 
          "域名已被保护，无法转移",
      });
    }
  });

  const generateAuthCode = useMutation({
    mutationFn: async () => {
      // 这里应该调用实际的API来生成验证码
      const newAuthCode = Math.random().toString(36).substring(2, 15);
      const { error } = await supabase
        .from('domains')
        .update({ auth_code: newAuthCode })
        .eq('id', domainId);
      
      if (error) throw error;
      return newAuthCode;
    },
    onSuccess: (newAuthCode) => {
      setAuthCode(newAuthCode);
      toast({
        title: "验证码已生成",
        description: "请保管好您的域名转移验证码",
      });
    }
  });

  if (isLoading) {
    return <LoadingState message="加载转移设置..." />;
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>域名转移保护</AlertTitle>
        <AlertDescription>
          转移锁可以防止未经授权的域名转移。建议在不需要转移域名时保持启用状态。
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
        <div>
          <h4 className="font-medium text-white">转移锁状态</h4>
          <p className="text-sm text-gray-400">
            {domain?.transfer_lock ? "已启用" : "已禁用"}
          </p>
        </div>
        <Button
          variant={domain?.transfer_lock ? "destructive" : "default"}
          onClick={() => toggleTransferLock.mutate()}
          disabled={toggleTransferLock.isPending}
        >
          {domain?.transfer_lock ? "解除锁定" : "启用锁定"}
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-white">转移验证码</h4>
        <div className="flex gap-4">
          <Input
            value={authCode}
            readOnly
            placeholder="点击生成按钮获取验证码"
          />
          <Button
            onClick={() => generateAuthCode.mutate()}
            disabled={generateAuthCode.isPending || domain?.transfer_lock}
          >
            生成验证码
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          注意：生成新的验证码会使旧验证码失效
        </p>
      </div>

      <div className="text-sm text-gray-400">
        <p className="font-medium mb-2">转移步骤：</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>解除域名转移锁</li>
          <li>生成转移验证码</li>
          <li>在新注册商处启动转移流程</li>
          <li>使用转移验证码确认转移</li>
        </ol>
      </div>
    </div>
  );
};

export default TransferSettings;