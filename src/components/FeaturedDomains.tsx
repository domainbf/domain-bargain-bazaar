import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Globe, DollarSign, Crown, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PayPalButton from './PayPalButton';
import { useNavigate } from 'react-router-dom';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
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

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'premium':
        return 'bg-purple-400/20 text-purple-300';
      case 'business':
        return 'bg-blue-400/20 text-blue-300';
      case 'standard':
        return 'bg-green-400/20 text-green-300';
      default:
        return 'bg-yellow-400/20 text-yellow-300';
    }
  };

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Crown className="h-8 w-8 text-yellow-400" />
        <span className="text-white">精选优质域名</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDomains.map((domain) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedDomain(domain)}
          >
            <Card className="p-6 bg-black/60 backdrop-blur-lg border border-white/20 hover:bg-black/70 transition-all cursor-pointer h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {domain.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getCategoryColor(domain.category)}`}>
                      {domain.category || '标准'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm min-h-[3rem]">
                  {domain.description || "优质域名，适合各类网站使用"}
                </p>
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-xl font-bold text-green-400">
                      ${domain.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-lg border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-400" />
              购买域名
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              您正在购买域名: <span className="font-semibold text-blue-400">{selectedDomain?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300 font-medium">域名价格</span>
                <div className="flex items-center text-green-400">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">${selectedDomain?.price}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <Tag className="h-5 w-5 text-blue-400 mt-0.5" />
                <p>类别: <span className="font-semibold">{selectedDomain?.category || '标准'}</span></p>
              </div>
            </div>

            {selectedDomain && (
              <div className="space-y-4">
                <h4 className="font-medium text-white">选择支付方式</h4>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <PayPalButton
                    amount={selectedDomain.price}
                    onSuccess={handlePurchaseSuccess}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedDomains;