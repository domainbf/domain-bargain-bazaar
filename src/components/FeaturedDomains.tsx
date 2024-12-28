import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DomainCard from './featured/DomainCard';
import PurchaseDialog from './featured/PurchaseDialog';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  status: string;
  is_featured: boolean;
}

const FeaturedDomains = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const { data: domains, isLoading } = useQuery({
    queryKey: ['featured-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .eq('is_featured', true)
        .order('price', { ascending: false });
      
      if (error) {
        toast({
          title: "错误提示",
          description: "无法加载精选域名",
          variant: "destructive",
        });
        throw error;
      }
      return data as Domain[];
    }
  });

  React.useEffect(() => {
    if (domains?.length) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % domains.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [domains?.length]);

  const handlePurchaseSuccess = async () => {
    if (selectedDomain) {
      try {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            domain_id: selectedDomain.id,
            amount: selectedDomain.price,
            payment_method: 'paypal',
            status: 'completed'
          });

        if (transactionError) throw transactionError;

        setSelectedDomain(null);
        toast({
          title: "购买成功",
          description: "域名已成功购买，请前往个人中心查看",
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Transaction error:', error);
        toast({
          title: "错误",
          description: "购买过程中出现错误，请稍后重试",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!domains?.length) {
    return null;
  }

  // Calculate visible domains based on screen size
  const visibleDomains = domains.slice(currentIndex, currentIndex + 3);
  if (visibleDomains.length < 3) {
    visibleDomains.push(...domains.slice(0, 3 - visibleDomains.length));
  }

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Crown className="h-8 w-8 text-yellow-400" />
        <span className="text-white">精选优质域名</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDomains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            onClick={setSelectedDomain}
          />
        ))}
      </div>

      <PurchaseDialog
        domain={selectedDomain}
        onOpenChange={() => setSelectedDomain(null)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default FeaturedDomains;