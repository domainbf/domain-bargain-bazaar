import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, DollarSign, Star, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PayPalButton from './PayPalButton';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

const FeaturedDomains = () => {
  const { toast } = useToast();
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);
  
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

  const handlePurchase = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  const handlePaymentSuccess = () => {
    setSelectedDomain(null);
    toast({
      title: "购买成功",
      description: "域名已成功购买，请前往个人中心查看",
    });
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

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Crown className="h-8 w-8 text-yellow-400" />
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          精选优质域名
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="domain-card"
          >
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {domain.name}
                    </h3>
                  </div>
                  <span className="price-tag bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    精选
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm min-h-[3rem]">
                  {domain.description || "优质域名，适合各类网站使用"}
                </p>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${domain.price.toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handlePurchase(domain)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    立即购买
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>购买域名: {selectedDomain?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold mb-4">
              价格: ${selectedDomain?.price}
            </p>
            {selectedDomain && (
              <PayPalButton
                amount={selectedDomain.price}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedDomains;