import { Circle, CircleMarker, FeatureGroup, MapContainer, Polygon, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import DentistInfo from "./DentistInfo";
import { useDentistsState } from "contexts/Dentists";
import { getCellsWithinGeoRadius } from "lib/dentists/core";
import { h3ToGeoBoundary } from "h3-js";
import { useEffect, useRef } from "react";

const MapZoomer = ({ searchLocation, searchRadius }) => {
  const map = useMap();
  const searchArea = useRef();

  // Zoom the map on search location / radius
  useEffect(() => {
    const bounds = searchArea.current.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }
  }, [map, searchLocation, searchRadius]);

  return (
    <FeatureGroup>
      <Circle
        ref={searchArea}
        center={[searchLocation.lat, searchLocation.lng]}
        radius={searchRadius * 1000}
        pathOptions={{ color: "blue", fillOpacity: 0, dashArray: [10, 20] }}
      />
    </FeatureGroup>
  );
};

const DentistCircle = ({ dentist }) => {
  const acceptingAnyPatients = Object.values(dentist.AcceptingPatients).some((v) => v);
  return (
    <CircleMarker
      center={[dentist.Latitude, dentist.Longitude]}
      pathOptions={{ color: acceptingAnyPatients ? "blue" : "gray" }}
    >
      <Popup>
        <DentistInfo dentist={dentist} />
      </Popup>
    </CircleMarker>
  );
};

const Map = ({ showCells = false, resolution }) => {
  const { dentists, searchLocation, searchRadius } = useDentistsState();
  const cells = getCellsWithinGeoRadius(searchLocation.lat, searchLocation.lng, searchRadius, resolution);
  const cellPolygons = cells.map((cell) => h3ToGeoBoundary(cell));

  // Geographic centre of GB - https://en.wikipedia.org/wiki/Centre_points_of_the_United_Kingdom#Great_Britain
  const center = [54.01, -2.33];
  const zoom = 7;
  return (
    <>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} preferCanvas={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapZoomer searchLocation={searchLocation} searchRadius={searchRadius} />
        {showCells &&
          cellPolygons.map((poly, i) => (
            <Polygon key={i} positions={poly} pathOptions={{ color: "red", fillOpacity: 0.25, opacity: 0.25 }} />
          ))}
        {dentists.map(
          (dentist) =>
            dentist.Latitude && dentist.Longitude && <DentistCircle key={dentist.ODSCode} dentist={dentist} />
        )}
      </MapContainer>
      <style>
        {`
          .leaflet-container {
            height: 100%;
          }
        `}
      </style>
    </>
  );
};

export default Map;
