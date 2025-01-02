import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useScrollingDomains } from '@/hooks/useScrollingDomains';
import PayPalButton from '@/components/PayPalButton';
import DomainScroller from './DomainScroller';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { supabase } from '@/lib/supabase';

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