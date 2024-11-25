import { SearchResult } from '../types/location';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export async function searchLocation(query: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    format: 'json',
    q: query,
    addressdetails: '1',
    limit: '5'
  });

  const response = await fetch(`${NOMINATIM_API}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }

  return response.json();
}

// Get IANA timezone based on longitude
export function getTimezone(lat: number, lon: number): string {
  // Default to a valid IANA timezone
  let timezone = 'UTC';
  
  try {
    // Calculate approximate timezone based on longitude
    const timezoneOffset = Math.round(lon / 15);
    const absoluteOffset = Math.abs(timezoneOffset);
    const sign = timezoneOffset >= 0 ? '+' : '-';
    const hours = absoluteOffset.toString().padStart(2, '0');
    
    // Convert to IANA timezone format
    timezone = `Etc/GMT${sign === '+' ? '-' : '+'}${hours}`; // Note: Etc/GMT uses opposite signs
  } catch (error) {
    console.error('Error calculating timezone:', error);
  }
  
  return timezone;
}

export function getCurrency(countryCode: string): string {
  const currencyMap: Record<string, string> = {
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    'AU': 'AUD',
    'CA': 'CAD',
    'JP': 'JPY',
    'CN': 'CNY',
    'IN': 'INR',
    'NZ': 'NZD',
    'CH': 'CHF',
    'SG': 'SGD',
    'HK': 'HKD',
    'KR': 'KRW',
    'BR': 'BRL',
    'ZA': 'ZAR',
    'RU': 'RUB',
    'MX': 'MXN',
    'AE': 'AED'
  };
  
  return currencyMap[countryCode] || 'USD';
}