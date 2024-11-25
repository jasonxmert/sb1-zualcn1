import React from 'react';
import { Location } from '../types/location';
import { SplitMap } from './SplitMap';

interface MapComponentProps {
  selectedLocation: Location | null;
}

export function MapComponent({ selectedLocation }: MapComponentProps) {
  return (
    <div className="flex-1 container mx-auto px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <SplitMap 
          position="center"
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}