import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { MapPopup } from './MapPopup';
import { Location } from '../types/location';
import { createMap } from '../utils/map';

interface SplitMapProps {
  position: 'left' | 'right' | 'center';
  selectedLocation: Location | null;
}

export function SplitMap({ position, selectedLocation }: SplitMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef<VectorSource | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    vectorSource.current = new VectorSource();
    mapInstance.current = createMap(mapRef.current, vectorSource.current);

    // Add click handler for marker
    mapInstance.current.on('click', (event) => {
      const feature = mapInstance.current?.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
        { hitTolerance: 5 }
      );
      
      if (feature) {
        const pixel = event.pixel;
        setPopupPosition({ x: pixel[0], y: pixel[1] });
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    });

    // Change cursor to pointer when hovering over marker
    mapInstance.current.on('pointermove', (event) => {
      if (mapInstance.current) {
        const pixel = mapInstance.current.getEventPixel(event.originalEvent);
        const hit = mapInstance.current.hasFeatureAtPixel(pixel);
        mapInstance.current.getTarget().style.cursor = hit ? 'pointer' : '';
      }
    });

    return () => {
      mapInstance.current?.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!selectedLocation || !vectorSource.current || !mapInstance.current) return;

    vectorSource.current.clear();
    setShowPopup(false);

    const marker = new Feature({
      geometry: new Point(fromLonLat(selectedLocation.coordinates))
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-red.png',
        scale: 0.5,
        crossOrigin: 'anonymous'
      })
    });

    marker.setStyle(markerStyle);
    vectorSource.current.addFeature(marker);

    // Animate to the new location
    mapInstance.current.getView().animate({
      center: fromLonLat(selectedLocation.coordinates),
      zoom: 12,
      duration: 1000
    });
  }, [selectedLocation]);

  return (
    <div className="relative h-[700px] w-full rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/10" />
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ 
          background: 'rgb(240, 243, 245)',
          transition: 'all 0.3s ease-in-out'
        }} 
      />
      {showPopup && popupPosition && selectedLocation && (
        <MapPopup
          location={selectedLocation}
          position={popupPosition}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}