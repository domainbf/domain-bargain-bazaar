import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Domain } from '@/types/domain';

interface DomainScrollerProps {
  domains: Domain[];
  direction?: 'left' | 'right';
  onDomainClick?: (domain: Domain) => void;
  status?: string;
}

const DomainScroller = ({ 
  domains, 
  direction = 'left',
  onDomainClick,
  status = 'available'
}: DomainScrollerProps) => {
  const { t } = useTranslation();
  const scrollContent = [...domains, ...domains];

  return (
    <motion.div
      animate={{
        x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
      }}
      transition={{
        duration: 40,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="inline-block"
    >
      {scrollContent.map((domain, index) => (
        <div
          key={`${domain.id}-${index}`}
          className="inline-block px-2"
          onClick={() => status === 'available' && onDomainClick?.(domain)}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-72 cursor-pointer hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{domain.name}</span>
              <div className="flex items-center text-green-400">
                <DollarSign className="h-4 w-4" />
                <span className="font-bold">{domain.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm px-2 py-1 rounded-full ${
                status === 'sold' ? 'bg-red-400/20 text-red-300' : 'bg-green-400/20 text-green-300'
              }`}>
                {t(`domain.status.${status}`)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default DomainScroller;