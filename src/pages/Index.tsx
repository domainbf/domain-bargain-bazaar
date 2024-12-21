import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DomainList from '@/components/DomainList';
import OfferForm from '@/components/OfferForm';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

const Index = () => {
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<{ name: string; price: number } | undefined>();
  const { toast } = useToast();

  const handleMakeOffer = (domain: { name: string; price: number }) => {
    setSelectedDomain(domain);
    setIsOfferFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
      <Navigation />
      
      <header className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Find Your Perfect Domain Name
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Browse through our curated selection of premium domain names and secure your digital identity today.
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400 text-gray-900"
                  placeholder="Search for domain names..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Domains</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="text-blue-600 font-semibold">Premium Domains</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">100+</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="text-purple-600 font-semibold">Price Range</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">$100 - $10k</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
              <div className="text-green-600 font-semibold">Instant Transfer</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">24/7</div>
            </div>
          </div>
        </div>
        
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