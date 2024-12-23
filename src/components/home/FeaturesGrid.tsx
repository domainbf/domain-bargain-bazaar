import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, Rocket } from 'lucide-react';

const FeaturesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-lg border border-purple-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">精品域名</h3>
        </div>
        <p className="text-gray-300">发现市场上最受欢迎的优质域名资源</p>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-lg border border-blue-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Globe2 className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">全球域名</h3>
        </div>
        <p className="text-gray-300">覆盖全球的域名交易网络</p>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-lg border border-pink-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Rocket className="h-6 w-6 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">快速部署</h3>
        </div>
        <p className="text-gray-300">便捷的域名转移和部署服务</p>
      </motion.div>
    </div>
  );
};

export default FeaturesGrid;