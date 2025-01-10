import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LoadingState } from '@/components/ui/loading-state';
import DNSSettings from './domain-settings/DNSSettings';
import NameserverSettings from './domain-settings/NameserverSettings';
import TransferSettings from './domain-settings/TransferSettings';

interface DomainSettingsProps {
  domainId: string | null;
  onClose: () => void;
}

const DomainSettings: React.FC<DomainSettingsProps> = ({ domainId, onClose }) => {
  const { data: domain, isLoading } = useQuery({
    queryKey: ['domain-details', domainId],
    queryFn: async () => {
      if (!domainId) return null;
      
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('id', domainId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!domainId
  });

  if (!domainId) return null;

  return (
    <Dialog open={!!domainId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            域名设置 - {domain?.name}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <LoadingState message="加载域名信息..." />
        ) : (
          <Tabs defaultValue="dns" className="mt-4">
            <TabsList className="grid grid-cols-3 gap-4 bg-gray-800">
              <TabsTrigger value="dns">DNS 记录</TabsTrigger>
              <TabsTrigger value="nameservers">域名服务器</TabsTrigger>
              <TabsTrigger value="transfer">域名转移</TabsTrigger>
            </TabsList>
            <TabsContent value="dns">
              <DNSSettings domainId={domainId} />
            </TabsContent>
            <TabsContent value="nameservers">
              <NameserverSettings domainId={domainId} />
            </TabsContent>
            <TabsContent value="transfer">
              <TransferSettings domainId={domainId} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DomainSettings;