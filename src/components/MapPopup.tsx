import React, { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Clock, Globe, DollarSign, MapPin, Flag, Mail } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import clsx from 'clsx';
import { Location } from '../types/location';

interface MapPopupProps {
  location: Location;
  position: { x: number; y: number };
  onClose: () => void;
}

export function MapPopup({ location, position, onClose }: MapPopupProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = React.useMemo(() => {
    try {
      return formatInTimeZone(currentTime, location.timezone, 'HH:mm:ss');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '00:00:00';
    }
  }, [currentTime, location.timezone]);

  return (
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ position: 'absolute', left: position.x, top: position.y }} />
      <Popover.Portal>
        <Popover.Content
          className={clsx(
            "bg-white rounded-lg shadow-lg p-6 w-96",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={5}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailCard
                icon={<Mail className="h-5 w-5 text-purple-500" />}
                label="Postcode"
                value={location.postcode}
              />
              <DetailCard
                icon={<Clock className="h-5 w-5 text-green-500" />}
                label="Local Time"
                value={formattedTime}
              />
              <DetailCard
                icon={<Globe className="h-5 w-5 text-indigo-500" />}
                label="Coordinates"
                value={`${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`}
              />
              <DetailCard
                icon={<DollarSign className="h-5 w-5 text-yellow-500" />}
                label="Currency"
                value={location.currency}
              />
              <DetailCard
                icon={<Flag className="h-5 w-5 text-red-500" />}
                label="Country Code"
                value={location.countryCode}
              />
              <DetailCard
                icon={<Globe className="h-5 w-5 text-blue-500" />}
                label="Domain"
                value={`.${location.countryCode.toLowerCase()}`}
              />
            </div>
          </div>

          <Popover.Close
            className="absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Popover.Close>

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailCard({ icon, label, value }: DetailCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 transition-all hover:bg-gray-100">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="font-medium text-gray-800 truncate">{value}</p>
    </div>
  );
}