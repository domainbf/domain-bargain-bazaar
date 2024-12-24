import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PayPalButton from './PayPalButton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', category],
    queryFn: async () => {
      let query = supabase
        .from('domains')
        .select('*')
        .eq('status', 'available');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
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
          <Card key={domain.id} className="p-6 hover:shadow-lg transition-shadow">
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
                onClick={() => handlePurchase(domain)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                购买
              </button>
            </div>
          </Card>
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
                domainId={selectedDomain.id}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DomainList;