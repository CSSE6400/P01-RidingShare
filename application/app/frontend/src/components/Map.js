import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Import the marker icon image
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import 'leaflet/dist/images/marker-shadow.png';

const SimpleMap = () => {
  const mapRef = useRef(null);
  const latitude = -27.4679;
  const longitude = 153.0215;

  const customIcon = new L.Icon({
    iconUrl: markerIconPng,
  });

  return ( 
    <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "100vh", width: "100vw"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>
          Let's finish this assignment already
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default SimpleMap;
