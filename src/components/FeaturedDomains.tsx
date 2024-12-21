import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, DollarSign } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface FeaturedDomainsProps {
  onMakeOffer: (domain: { name: string; price: number }) => void;
}

const FeaturedDomains = ({ onMakeOffer }: FeaturedDomainsProps) => {
  const { data: domains, isLoading } = useQuery({
    queryKey: ['featured-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .eq('category', 'featured')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Domain[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (!domains?.length) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Domains</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {domains.map((domain) => (
            <CarouselItem key={domain.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="p-6 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {domain.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">{domain.description}</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-xl font-bold text-green-600">
                      ${domain.price.toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    onClick={() => onMakeOffer(domain)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Make Offer
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FeaturedDomains;