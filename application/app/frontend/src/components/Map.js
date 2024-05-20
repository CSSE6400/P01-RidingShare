import React, { useRef } from "react";
import { MapContainer, TileLayer} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import 'leaflet/dist/images/marker-shadow.png';
import Routing from "./Routing";

const locations = [
  { lat: -27.4679, lng: 153.0215, name: "Start Point" },
  { lat: -27.4705, lng: 153.0265, name: "Mid Point" },
  { lat: -27.4517, lng: 153.0412, name: "End Point" }
];

const SimpleMap = () => {
  const mapRef = useRef(null);
  const latitude = -27.4679;
  const longitude = 153.0215;


  return ( 
    <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "100vh", width: "100vw"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Routing waypoints={locations} />
    </MapContainer>
  );
};

export default SimpleMap;
