import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issue in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom SVG pin icon factory
const createPinIcon = (color = '#0d9488', size = 36) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.4}" viewBox="0 0 40 56">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/>
      </filter>
      <ellipse cx="20" cy="53" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
      <path d="M20 2C11.16 2 4 9.16 4 18c0 12 16 34 16 34s16-22 16-34C36 9.16 28.84 2 20 2z"
        fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
      <circle cx="20" cy="18" r="8" fill="white" opacity="0.9"/>
      <text x="20" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="${color}" font-family="Arial">P</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size * 1.4],
    iconAnchor: [size / 2, size * 1.4],
    popupAnchor: [0, -(size * 1.4)],
  });
};

const activeIcon = createPinIcon('#ef4444', 42);   // red for selected
const defaultIcon = createPinIcon('#0d9488', 36);  // teal for normal

// Smoothly pan map to a position
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapComponent = ({ areas = [], onAreaSelect, selectedArea }) => {
  const chennaiCenter = [13.0827, 80.2707];
  const validAreas = areas.filter(a => a.lat && a.lng);

  return (
    <MapContainer
      center={chennaiCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedArea?.lat && selectedArea?.lng && (
        <ChangeView center={[selectedArea.lat, selectedArea.lng]} zoom={15} />
      )}

      {validAreas.map(area => {
        const isActive = selectedArea?._id === area._id;
        return (
          <Marker
            key={area._id}
            position={[area.lat, area.lng]}
            icon={isActive ? activeIcon : defaultIcon}
            eventHandlers={{ click: () => onAreaSelect && onAreaSelect(area) }}
          >
            <Popup className="parking-popup" maxWidth={220}>
              <div style={{ padding: '4px 2px', minWidth: '180px' }}>
                <div style={{
                  background: isActive ? '#ef4444' : '#0d9488',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px 8px 0 0',
                  fontWeight: 700,
                  fontSize: '14px',
                  margin: '-4px -2px 8px -2px',
                }}>
                  {area.name}
                </div>
                <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '6px', lineHeight: '1.4' }}>
                  {area.address}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    background: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    color: '#475569',
                    fontWeight: 600,
                  }}>
                    {area.type} · {area.totalSlots || '?'} slots
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAreaSelect && onAreaSelect(area); }}
                    style={{
                      background: '#0d9488',
                      color: 'white',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    View Slots
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
