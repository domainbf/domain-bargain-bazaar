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
import { Globe, DollarSign, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface FeaturedDomainsProps {
  onMakeOffer: (domain: Domain) => void;
}

const FeaturedDomains = ({ onMakeOffer }: FeaturedDomainsProps) => {
  const { toast } = useToast();
  
  const { data: domains, isLoading } = useQuery({
    queryKey: ['featured-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('status', 'available')
        .eq('is_featured', true)
        .order('price', { ascending: false });
      
      if (error) {
        toast({
          title: "错误",
          description: "无法加载精选域名",
          variant: "destructive",
        });
        throw error;
      }
      return data as Domain[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!domains?.length) {
    return null;
  }

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <Star className="h-8 w-8 text-yellow-400" />
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          精选域名
        </span>
      </h2>
      <Carousel className="w-full">
        <CarouselContent>
          {domains.map((domain) => (
            <CarouselItem key={domain.id} className="md:basis-1/2 lg:basis-1/3">
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                className="p-1"
              >
                <Card className="p-6 bg-black/40 backdrop-blur-lg border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {domain.name}
                        </h3>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                        精选
                      </span>
                    </div>
                    <p className="text-gray-100 text-sm min-h-[3rem] bg-black/30 p-2 rounded-md">
                      {domain.description}
                    </p>
                    <div className="flex items-center space-x-2 bg-black/30 p-2 rounded-md">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-xl font-bold text-white">
                        ${domain.price.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      onClick={() => onMakeOffer(domain)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                    >
                      立即购买
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-black/40 text-white hover:bg-black/60 border-0" />
        <CarouselNext className="bg-black/40 text-white hover:bg-black/60 border-0" />
      </Carousel>
    </div>
  );
};

export default FeaturedDomains;