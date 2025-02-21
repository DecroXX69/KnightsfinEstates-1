import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (default Leaflet marker won't load properly in React)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapComponent = () => {
  const position = [18.5642, 73.7769]; // Coordinates for TecMetaverse, Pune

  return (
    <MapContainer center={position} zoom={15} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <strong>TecMetaverse</strong>
          <br />
          Office 506, HQ7C+MC2 PYRAMID AXIS, 112/1/2, Baner Rd,
          <br />
          Behind Croma Showroom, Veerbhadra Nagar, Baner, Pune, Maharashtra 411045
          <br />
          ⭐ 5.0 (14 reviews)
          <br />
          <a href="https://maps.app.goo.gl/GUrkjZvquVYgFrbq8" target="_blank" rel="noopener noreferrer">
            View on Google Maps
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
