import React from 'react';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedDomains } from '@/hooks/useFeaturedDomains';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import DomainCard from './featured/DomainCard';
import PurchaseDialog from './featured/PurchaseDialog';

const FeaturedDomains = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = React.useState(null);
  const { data: domains, isLoading, error, refetch } = useFeaturedDomains();

  if (isLoading) {
    return <LoadingState message="正在加载精选域名..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="加载精选域名时出错" 
        onRetry={() => refetch()} 
      />
    );
  }

  if (!domains?.length) {
    return null;
  }

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Crown className="h-8 w-8 text-yellow-400" />
        <span className="text-white">精选优质域名</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
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
        onSuccess={() => {
          setSelectedDomain(null);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default FeaturedDomains;