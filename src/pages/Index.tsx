import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DomainList from '@/components/DomainList';
import OfferForm from '@/components/OfferForm';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<{ name: string; price: number } | undefined>();
  const { toast } = useToast();

  const handleMakeOffer = (domain: { name: string; price: number }) => {
    setSelectedDomain(domain);
    setIsOfferFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navigation />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">
            Premium Domain Names
          </h1>
          <p className="mt-2 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Find your perfect domain name and make it yours today
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12">
        <DomainList onMakeOffer={handleMakeOffer} />
        <OfferForm
          isOpen={isOfferFormOpen}
          onClose={() => setIsOfferFormOpen(false)}
          selectedDomain={selectedDomain}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;