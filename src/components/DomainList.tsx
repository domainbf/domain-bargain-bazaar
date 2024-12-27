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
  DialogDescription,
} from "@/components/ui/dialog";
import PayPalButton from './PayPalButton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, DollarSign, ShieldCheck } from 'lucide-react';

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
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-500" />
              购买域名
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              您正在购买域名: <span className="font-semibold text-blue-600">{selectedDomain?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">域名价格</span>
                <div className="flex items-center text-blue-600">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">{selectedDomain?.price}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                <p>
                  支付完成后，域名将立即转入您的账户。我们提供安全的支付环境和完整的购买保障。
                </p>
              </div>
            </div>

            {selectedDomain && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">选择支付方式</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <PayPalButton
                    amount={selectedDomain.price}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DomainList;