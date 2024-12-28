import React from 'react';
import { motion } from 'framer-motion';
import { Globe, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  status: string;
}

interface DomainCardProps {
  domain: Domain;
  onClick: (domain: Domain) => void;
}

const DomainCard = ({ domain, onClick }: DomainCardProps) => {
  const { t } = useTranslation();

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'premium':
        return 'bg-purple-400/20 text-purple-300';
      case 'business':
        return 'bg-blue-400/20 text-blue-300';
      case 'standard':
        return 'bg-green-400/20 text-green-300';
      default:
        return 'bg-yellow-400/20 text-yellow-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onClick={() => onClick(domain)}
    >
      <Card className="p-6 bg-black/60 backdrop-blur-lg border border-white/20 hover:bg-black/70 transition-all cursor-pointer h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                {domain.name}
              </h3>
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getCategoryColor(domain.category)}`}>
                {t(`domain.category.${domain.category.toLowerCase()}`)}
              </span>
              {domain.status === 'sold' && (
                <span className="px-2 py-1 rounded-full text-sm font-medium bg-red-400/20 text-red-300">
                  {t('domain.status.sold')}
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-sm min-h-[3rem]">
            {domain.description || t('domain.no_description')}
          </p>
          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-xl font-bold text-green-400">
                ${domain.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DomainCard;