import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PayPalButton from '@/components/PayPalButton';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: string;
}

interface ScrollingDomainsProps {
  direction?: 'left' | 'right';
  status?: string;
  className?: string;
}

const ScrollingDomains = ({ direction = 'left', status = 'available', className = '' }: ScrollingDomainsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);
  
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Domain[];
    }
  });

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

        toast({
          title: t('purchase.success.title'),
          description: t('purchase.success.description'),
        });
        
        setSelectedDomain(null);
        navigate('/dashboard');
      } catch (error) {
        console.error('Transaction error:', error);
        toast({
          title: t('purchase.error.title'),
          description: t('purchase.error.description'),
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading || !domains?.length) return null;

  const scrollContent = [...domains, ...domains];

  return (
    <>
      <div className={`overflow-hidden whitespace-nowrap ${className}`}>
        <motion.div
          animate={{
            x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="inline-block"
        >
          {scrollContent.map((domain, index) => (
            <div
              key={`${domain.id}-${index}`}
              className="inline-block px-2"
              onClick={() => status === 'available' && setSelectedDomain(domain)}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-72 cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{domain.name}</span>
                  <div className="flex items-center text-green-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{domain.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    status === 'sold' ? 'bg-red-400/20 text-red-300' : 'bg-green-400/20 text-green-300'
                  }`}>
                    {t(`domain.status.${status}`)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <Dialog open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t('purchase.dialog.title')}: {selectedDomain?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold text-white mb-4">
              {t('purchase.dialog.price')}: ${selectedDomain?.price}
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
    </>
  );
};

export default ScrollingDomains;