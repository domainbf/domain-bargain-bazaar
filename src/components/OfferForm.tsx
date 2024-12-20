import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
      const response = await fetch('/api/submit-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Offer Submitted!",
          description: "We'll get back to you soon.",
        });
        onClose();
      } else {
        throw new Error('Failed to submit offer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make an Offer for {selectedDomain?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input name="name" placeholder="Your Name" required />
          </div>
          <div>
            <Input name="email" type="email" placeholder="Your Email" required />
          </div>
          <div>
            <Input 
              name="offer" 
              type="number" 
              placeholder="Your Offer (USD)" 
              min="1"
              required 
            />
          </div>
          <div>
            <Textarea 
              name="message" 
              placeholder="Additional Message (Optional)"
              rows={4}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Offer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferForm;