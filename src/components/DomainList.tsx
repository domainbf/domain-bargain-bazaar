import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDomains } from '@/hooks/useDomains';
import DomainCard from './domain/DomainCard';
import PurchaseDialog from './domain/PurchaseDialog';

interface Domain {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string | null;
  status: string | null;
}

const DomainList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);

  const { data: domains, isLoading } = useDomains(category);

  const handlePurchase = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  const handlePaymentSuccess = () => {
    setSelectedDomain(null);
    toast({
      title: "购买成功",
      description: "域名已成功购买",
    });
    navigate('/dashboard');
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains?.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      <PurchaseDialog
        domain={selectedDomain}
        onOpenChange={() => setSelectedDomain(null)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default DomainList;