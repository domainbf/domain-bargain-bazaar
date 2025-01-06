import { Globe } from 'lucide-react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from '@/hooks/useTranslation';

interface PurchaseHeaderProps {
  domainName: string;
}

export const PurchaseHeader = ({ domainName }: PurchaseHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      <DialogHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-purple-200" />
          <span className="text-sm font-medium text-purple-200">
            {t('purchase_dialog_title')}
          </span>
        </div>
        <DialogTitle className="text-4xl font-bold tracking-tight mb-2">
          {domainName}
        </DialogTitle>
      </DialogHeader>
    </div>
  );
};