import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useScrollingDomains } from '@/hooks/useScrollingDomains';
import PayPalButton from '@/components/PayPalButton';
import DomainScroller from './DomainScroller';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { supabase } from '@/lib/supabase';
import { Globe, DollarSign, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ScrollingDomainsProps {
  direction?: 'left' | 'right';
  status?: string;
  className?: string;
}

const ScrollingDomains = ({ 
  direction = 'left', 
  status = 'available', 
  className = '' 
}: ScrollingDomainsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedDomain, setSelectedDomain] = React.useState(null);
  
  const { 
    data: domains, 
    isLoading, 
    error,
    refetch 
  } = useScrollingDomains(status);

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

        const { error: domainError } = await supabase
          .from('domains')
          .update({ status: 'sold' })
          .eq('id', selectedDomain.id);

        if (domainError) throw domainError;

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

  if (isLoading) {
    return <LoadingState message={t('loading.domains')} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={t('error.loading.domains')}
        onRetry={() => refetch()}
      />
    );
  }

  if (!domains?.length) {
    return (
      <div className="text-center p-4 text-gray-400">
        {status === 'available' ? t('domains.none.available') : t('domains.none.sold')}
      </div>
    );
  }

  return (
    <>
      <div className={`overflow-hidden whitespace-nowrap ${className}`}>
        <DomainScroller
          domains={domains}
          direction={direction}
          onDomainClick={setSelectedDomain}
          status={status}
        />
      </div>

      <Dialog open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-black border border-white/10">
          <DialogHeader className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-6 w-6 text-blue-400" />
              <DialogTitle className="text-2xl font-bold text-white">
                {selectedDomain?.name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-400">
              {t('domain.purchase.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="mb-2 text-sm font-medium text-gray-300">{t('domain.price')}</div>
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold text-white">
                  {selectedDomain?.price.toLocaleString()}
                </span>
                <span className="text-gray-300">USD</span>
              </div>
            </div>

            <div className="grid gap-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-6"
                onClick={() => {}}
              >
                {t('domain.purchase.buyNow')}
              </Button>
              <Button 
                variant="outline"
                className="w-full border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/30"
                onClick={() => {}}
              >
                {t('domain.purchase.makeOffer')}
              </Button>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm border border-white/10">
              {selectedDomain && (
                <PayPalButton
                  amount={selectedDomain.price}
                  onSuccess={handlePurchaseSuccess}
                />
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-white/10">
              <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-white">
                  {t('domain.purchase.secureTransaction')}
                </p>
                <p className="text-sm text-gray-300">
                  {t('domain.purchase.protection')}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScrollingDomains;