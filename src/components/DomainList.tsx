import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'sold';
}

const DomainList = ({ onMakeOffer }: { onMakeOffer: (domain: Domain) => void }) => {
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Domain[];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading domains...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {domains?.map((domain) => (
        <Card key={domain.id} className="domain-card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="text-xl font-bold mb-4 text-purple-600">{domain.name}</h3>
          <div className="mb-4">
            <span className="price-tag bg-purple-100 text-purple-800">
              ${domain.price.toLocaleString()}
            </span>
          </div>
          <Button 
            onClick={() => onMakeOffer(domain)}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            Make Offer
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default DomainList;