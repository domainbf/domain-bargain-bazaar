import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, Rocket } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const FeaturesGrid = () => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-lg border border-purple-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">{t('features.premium.title')}</h3>
        </div>
        <p className="text-gray-300">{t('features.premium.description')}</p>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-lg border border-blue-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Globe2 className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{t('features.global.title')}</h3>
        </div>
        <p className="text-gray-300">{t('features.global.description')}</p>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-lg border border-pink-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Rocket className="h-6 w-6 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">{t('features.transfer.title')}</h3>
        </div>
        <p className="text-gray-300">{t('features.transfer.description')}</p>
      </motion.div>
    </div>
  );
};

export default FeaturesGrid;