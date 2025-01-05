import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PurchaseDialog from '@/components/shared/PurchaseDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Domain {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string | null;
  status: string | null;
}

interface DomainCardProps {
  domain: Domain;
  onPurchase?: (domain: Domain) => void;
}

const DomainCard = ({ domain, onPurchase }: DomainCardProps) => {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePurchaseSuccess = (paymentId: string) => {
    toast({
      title: "购买成功",
      description: "域名已成功购买",
    });
    setShowPurchaseDialog(false);
    navigate('/dashboard');
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{domain.name}</h3>
            <p className="text-sm text-gray-500">{domain.description}</p>
          </div>
          <Badge variant={domain.category === 'premium' ? 'default' : 'secondary'}>
            {domain.category}
          </Badge>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold">${domain.price}</span>
          <button
            onClick={() => setShowPurchaseDialog(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            购买
          </button>
        </div>
      </Card>

      <PurchaseDialog
        domain={domain}
        onOpenChange={setShowPurchaseDialog}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
};

export default DomainCard;