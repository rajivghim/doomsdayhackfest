import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Search, 
  Loader2, 
  Check, 
  RotateCcw,
  Compass,
  Crosshair,
  Sparkles
} from 'lucide-react';

// Custom Eye-Catching Map Marker Icon
const createCustomMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-19px, -38px);
      ">
        <div style="
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(185, 28, 28, 0.25);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #b91c1c;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(185, 28, 28, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        ">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

export interface SelectedLocationData {
  address: string;
  coordinates: { lat: number; lng: number };
  ward?: string;
}

interface OpenSourceLocationPickerProps {
  initialCoordinates?: { lat: number; lng: number };
  initialLocationName?: string;
  onLocationSelect: (data: SelectedLocationData) => void;
}

const DEFAULT_CENTER = { lat: 27.7172, lng: 85.3240 }; // Kathmandu Valley

const POPULAR_HUBS = [
  { label: 'Kathmandu Central', lat: 27.7172, lng: 85.3240, ward: 'Ward 4' },
  { label: 'Lalitpur (Patan)', lat: 27.6710, lng: 85.3250, ward: 'Ward 3' },
  { label: 'Bhaktapur Square', lat: 27.6715, lng: 85.4298, ward: 'Ward 2' },
  { label: 'Baneshwor Chowk', lat: 27.6915, lng: 85.3420, ward: 'Ward 10' },
  { label: 'Pokhara Lakeside', lat: 28.2096, lng: 83.9856, ward: 'Ward 6' },
];

export const OpenSourceLocationPicker: React.FC<OpenSourceLocationPickerProps> = ({
  initialCoordinates,
  initialLocationName,
  onLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    initialCoordinates || DEFAULT_CENTER
  );
  const [address, setAddress] = useState<string>(initialLocationName || '');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Reverse Geocoding helper using OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const addrObj = data.address || {};
        
        const parts: string[] = [];
        if (addrObj.road || addrObj.street || addrObj.pedestrian) {
          parts.push(addrObj.road || addrObj.street || addrObj.pedestrian);
        }
        if (addrObj.neighbourhood || addrObj.suburb || addrObj.residential) {
          parts.push(addrObj.neighbourhood || addrObj.suburb || addrObj.residential);
        }
        if (addrObj.city || addrObj.town || addrObj.municipality) {
          parts.push(addrObj.city || addrObj.town || addrObj.municipality);
        }
        
        let detectedWard = '';
        if (addrObj.suburb && addrObj.suburb.toLowerCase().includes('ward')) {
          detectedWard = addrObj.suburb;
        }

        const formattedAddress = parts.length > 0 ? parts.join(', ') : (data.display_name?.split(',').slice(0, 3).join(',') || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        
        setAddress(formattedAddress);
        onLocationSelect({
          address: formattedAddress,
          coordinates: { lat, lng },
          ward: detectedWard || undefined,
        });
      } else {
        const fallback = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddress(fallback);
        onLocationSelect({
          address: fallback,
          coordinates: { lat, lng },
        });
      }
    } catch {
      const fallback = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(fallback);
      onLocationSelect({
        address: fallback,
        coordinates: { lat, lng },
      });
    } finally {
      setIsReverseGeocoding(false);
    }
  }, [onLocationSelect]);

  const updateLocation = useCallback((lat: number, lng: number, skipGeocode = false) => {
    setCoords({ lat, lng });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (!skipGeocode) {
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const startLat = coords.lat;
    const startLng = coords.lng;

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // High quality Voyager / OSM clean style tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    }).addTo(map);

    const marker = L.marker([startLat, startLng], {
      icon: createCustomMarkerIcon(),
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updateLocation(pos.lat, pos.lng);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocation(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    if (!address) {
      reverseGeocode(startLat, startLng);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // GPS Present Location
  const handleUsePresentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported.');
      return;
    }

    setIsLocating(true);
    setGpsStatus('Pinpointing your device coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsLocating(false);
        setGpsStatus('Location locked via GPS');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1 });
        }
        updateLocation(latitude, longitude);
      },
      () => {
        setIsLocating(false);
        setGpsStatus('GPS access denied or unavailable. Click directly on map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Search location
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGpsStatus(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lng = parseFloat(results[0].lon);
          const label = results[0].display_name.split(',').slice(0, 3).join(',');

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 0.8 });
          }
          setCoords({ lat, lng });
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }
          setAddress(label);
          onLocationSelect({ address: label, coordinates: { lat, lng } });
          setGpsStatus(`Found: ${label}`);
        } else {
          setGpsStatus('Area not found. Click directly on the map to pin.');
        }
      }
    } catch {
      setGpsStatus('Search service busy. Please click on the map.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectHub = (hub: typeof POPULAR_HUBS[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hub.lat, hub.lng], 15, { duration: 0.7 });
    }
    updateLocation(hub.lat, hub.lng);
  };

  return (
    <div className="space-y-3">
      {/* Search & GPS Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          type="button"
          onClick={handleUsePresentLocation}
          disabled={isLocating}
          className="px-3.5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
        >
          {isLocating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Navigation size={14} className="text-white fill-white" />
              <span>Present Location</span>
            </>
          )}
        </button>

        <div className="flex-1 flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search area (e.g. Maitighar, Patan, New Road)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-red-700"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-neutral-400" />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium cursor-pointer disabled:opacity-40"
          >
            {isSearching ? <Loader2 size={13} className="animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {/* Quick Landmark Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] scrollbar-none">
        <span className="text-neutral-500 font-mono text-[10px] uppercase shrink-0">Hubs:</span>
        {POPULAR_HUBS.map((hub, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectHub(hub)}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-red-50 hover:text-red-800 border border-neutral-200 text-neutral-700 whitespace-nowrap transition-colors cursor-pointer text-xs"
          >
            {hub.label}
          </button>
        ))}
      </div>

      {/* Interactive Map Visual */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-300/80 shadow-xs bg-neutral-100">
        <div 
          ref={mapContainerRef} 
          className="w-full h-56 sm:h-64 z-0" 
        />

        {/* Eye-catching floating hint banner */}
        <div className="absolute top-2.5 left-2.5 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-mono text-neutral-800 flex items-center gap-1.5 shadow-2xs">
          <Compass size={13} className="text-red-700" />
          <span>Click anywhere on the map or drag pin to position</span>
        </div>

        <div className="absolute bottom-2.5 right-2.5 z-[400] bg-neutral-900/90 text-white backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      </div>

      {/* Geocode Address Confirmation Card */}
      <div className="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
            <MapPin size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Selected Civic Ward / Address
            </div>
            <p className="text-xs font-semibold text-neutral-900 truncate">
              {address || 'Click on the map to pin'}
            </p>
          </div>
        </div>

        {isReverseGeocoding ? (
          <span className="text-[11px] font-mono text-red-700 flex items-center gap-1 shrink-0">
            <Loader2 size={11} className="animate-spin" /> Locating...
          </span>
        ) : (
          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            ✓ Locked
          </span>
        )}
      </div>
    </div>
  );
};
