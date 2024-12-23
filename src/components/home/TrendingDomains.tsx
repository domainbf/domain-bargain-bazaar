import React from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Domain {
  id: string;
  name: string;
  price: number;
}

interface TrendingDomainsProps {
  domains: Domain[] | null;
}

const TrendingDomains = ({ domains }: TrendingDomainsProps) => {
  if (!domains?.length) return null;

  return (
    <div className="relative z-10 bg-black/30 backdrop-blur-md py-4 overflow-hidden border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {domains.map((domain) => (
              <CarouselItem key={domain.id} className="md:basis-1/3 lg:basis-1/4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-2"
                >
                  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{domain.name}</span>
                      <span className="text-green-400 font-bold">${domain.price}</span>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-black/40 text-white hover:bg-black/60 border-0" />
          <CarouselNext className="bg-black/40 text-white hover:bg-black/60 border-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default TrendingDomains;