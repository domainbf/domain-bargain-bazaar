import { Globe } from 'lucide-react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from '@/hooks/useTranslation';

interface PurchaseHeaderProps {
  domainName: string;
}

export const PurchaseHeader = ({ domainName }: PurchaseHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 animate-pulse" />
      <DialogHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-blue-200" />
          <span className="text-sm font-medium text-blue-200">
            {t('domain.purchase.description')}
          </span>
        </div>
        <DialogTitle className="text-4xl font-bold tracking-tight mb-2">
          {domainName}
        </DialogTitle>
      </DialogHeader>
    </div>
  );
};