import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

interface Domain {
  id: string;
  name: string;
  price: number;
  status?: string;
}

export const useDomainPurchase = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handlePurchase = async (paymentId: string) => {
    if (!selectedDomain) return;

    setIsProcessing(true);
    try {
      // 记录交易
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          domain_id: selectedDomain.id,
          amount: selectedDomain.price,
          payment_method: 'paypal',
          payment_id: paymentId,
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      // 更新域名状态
      const { error: domainError } = await supabase
        .from('domains')
        .update({ status: 'sold' })
        .eq('id', selectedDomain.id);

      if (domainError) throw domainError;

      // 刷新域名列表
      await queryClient.invalidateQueries({ queryKey: ['domains'] });
      await queryClient.invalidateQueries({ queryKey: ['featured-domains'] });

      toast({
        title: "购买成功",
        description: "域名已成功购买，您可以在仪表板中查看详情",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "购买失败",
        description: "处理您的购买请求时出错，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedDomain(null);
    }
  };

  return {
    selectedDomain,
    setSelectedDomain,
    isProcessing,
    handlePurchase,
  };
};