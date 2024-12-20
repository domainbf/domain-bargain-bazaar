import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Domain {
  name: string;
  price: number;
}

const domains: Domain[] = [
  { name: "example.com", price: 5000 },
  { name: "domain.net", price: 3000 },
  { name: "website.org", price: 2500 },
  { name: "site.io", price: 1500 },
];

interface DomainListProps {
  onMakeOffer: (domain: Domain) => void;
}

const DomainList: React.FC<DomainListProps> = ({ onMakeOffer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {domains.map((domain) => (
        <Card key={domain.name} className="domain-card p-6">
          <h3 className="text-xl font-bold mb-4">{domain.name}</h3>
          <div className="mb-4">
            <span className="price-tag">
              ${domain.price.toLocaleString()}
            </span>
          </div>
          <Button 
            onClick={() => onMakeOffer(domain)}
            className="w-full"
          >
            Make Offer
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default DomainList;