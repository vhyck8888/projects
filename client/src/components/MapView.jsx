// MapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';  // Optional, if you have custom styles for the map

const MapView = ({ cases }) => {
  return (
    <div className="leaflet-container">
      <MapContainer 
        center={[38.5, -80.0]} // Default map center (can be updated)
        zoom={6} 
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map Markers for each case */}
        {cases.map((c) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]}>
            <Popup>
              <strong>{c.name}</strong><br />
              {c.date}<br />
              {c.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
