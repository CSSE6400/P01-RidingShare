import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
const customIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],  
    iconAnchor: [12, 41],  
    popupAnchor: [1, -34],  
  });

const createRoutineMachineLayer = ({waypoints}) => {
  const instance = L.Routing.control({
    waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
    lineOptions: {
        styles: [
          {
            color: "blue",
            opacity: 0.6,
            weight: 4
          }
        ]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      show: false,
      createMarker: function(i, wp) {
        return L.marker(wp.latLng, {
          icon: customIcon
        });
      }
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;