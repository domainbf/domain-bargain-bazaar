import React, { useState } from 'react';
import DomainList from '@/components/DomainList';
import OfferForm from '@/components/OfferForm';

const Index = () => {
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<{ name: string; price: number } | undefined>();

  const handleMakeOffer = (domain: { name: string; price: number }) => {
    setSelectedDomain(domain);
    setIsOfferFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Premium Domains</h1>
          <p className="mt-2 text-gray-600">Find your perfect domain name</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6">
        <DomainList onMakeOffer={handleMakeOffer} />
        <OfferForm
          isOpen={isOfferFormOpen}
          onClose={() => setIsOfferFormOpen(false)}
          selectedDomain={selectedDomain}
        />
      </main>
    </div>
  );
};

export default Index;