import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { STREAMING_SERVICES, REGIONS, type StreamingService, type Region } from '../services/streamingService';

interface ServiceSelectorProps {
  onSelectionComplete: (services: string[], region: string) => void;
  isLoading?: boolean;
}

export const ServiceSelector = ({ onSelectionComplete, isLoading }: ServiceSelectorProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleStart = () => {
    if (selectedServices.length > 0 && selectedRegion) {
      onSelectionComplete(selectedServices, selectedRegion);
    }
  };

  const isValid = selectedServices.length > 0 && selectedRegion && !isLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-8">
      <div className="max-w-md mx-auto w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">MovieMatch</h1>
          <p className="text-muted-foreground">Choose your streaming services and region</p>
        </div>

        {/* Streaming Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Streaming Services</h2>
          <div className="grid grid-cols-2 gap-3">
            {STREAMING_SERVICES.map((service: StreamingService) => (
              <Card
                key={service.id}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  selectedServices.includes(service.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleService(service.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.logo}</span>
                    <span className="font-medium text-foreground">{service.name}</span>
                  </div>
                  {selectedServices.includes(service.id) && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Region</h2>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {REGIONS.map((region: Region) => (
              <Card
                key={region.code}
                className={`p-3 cursor-pointer transition-all duration-200 border ${
                  selectedRegion === region.code
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRegion(region.code)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{region.name}</span>
                  {selectedRegion === region.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          disabled={!isValid}
          className="w-full py-6 text-lg font-semibold bg-gradient-primary hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading Movies...
            </>
          ) : (
            'Start MovieMatch'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {selectedServices.length > 0 && selectedRegion ? (
            `Ready to find movies on ${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''}`
          ) : (
            'Select at least one service and region to continue'
          )}
        </p>
      </div>
    </div>
  );
};