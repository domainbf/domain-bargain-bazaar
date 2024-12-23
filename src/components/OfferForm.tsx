import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign } from 'lucide-react';

interface OfferFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDomain?: { name: string; price: number };
}

const OfferForm: React.FC<OfferFormProps> = ({ isOpen, onClose, selectedDomain }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      offer: formData.get('offer'),
      message: formData.get('message'),
      domain: selectedDomain?.name
    };

    try {
      // In a real application, this would be connected to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "报价已提交！",
        description: "我们会尽快与您联系。",
      });
      onClose();
    } catch (error) {
      toast({
        title: "错误",
        description: "提交报价失败，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-lg border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">为 {selectedDomain?.name} 出价</DialogTitle>
          <DialogDescription className="text-gray-400">
            当前价格: ${selectedDomain?.price?.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input 
              name="name" 
              placeholder="您的姓名" 
              required 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Input 
              name="email" 
              type="email" 
              placeholder="您的邮箱" 
              required 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              name="offer" 
              type="number" 
              placeholder="您的报价 (USD)" 
              min="1"
              required 
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Textarea 
              name="message" 
              placeholder="附加信息（可选）"
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "提交中..." : "提交报价"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferForm;