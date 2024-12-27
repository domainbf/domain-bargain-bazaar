import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Globe, DollarSign, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const currentDomain = domains[currentIndex];

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Crown className="h-8 w-8 text-yellow-400" />
        <span className="text-white">
          精选优质域名
        </span>
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDomain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedDomain(currentDomain)}
          >
            <Card className="p-6 bg-black/60 backdrop-blur-lg border border-white/20 hover:bg-black/70 transition-all cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {currentDomain.name}
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-sm font-medium">
                    精选
                  </span>
                </div>
                <p className="text-gray-300 text-sm min-h-[3rem]">
                  {currentDomain.description || "优质域名，适合各类网站使用"}
                </p>
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-xl font-bold text-green-400">
                      ${currentDomain.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">购买域名: {selectedDomain?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold text-white mb-4">
              价格: ${selectedDomain?.price}
            </p>
            {selectedDomain && (
              <PayPalButton
                amount={selectedDomain.price}
                onSuccess={handlePurchaseSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedDomains;