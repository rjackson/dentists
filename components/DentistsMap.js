import { Circle, CircleMarker, FeatureGroup, MapContainer, Polygon, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import DentistInfo from "@components/DentistInfo";
import { useDentistsState } from "@contexts/Dentists";
import { getCellsWithinGeoRadius, resolutionForRadius } from "lib/dentists/core";
import { h3ToGeoBoundary } from "h3-js";
import { useEffect, useRef } from "react";
import useResizeObserver from "@react-hook/resize-observer";

const MapZoomer = () => {
  const { searchLocation, searchRadius } = useDentistsState();

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
  const pathOptions = {
    color: acceptingAnyPatients ? "blue" : "gray",
    fillOpacity: 0.2,
    opacity: acceptingAnyPatients ? 1 : 0.75,
  };

  const radius = acceptingAnyPatients ? 10 : 7;

  return (
    <CircleMarker center={[dentist.Latitude, dentist.Longitude]} pathOptions={pathOptions} radius={radius}>
      <Popup>
        <DentistInfo dentist={dentist} />
      </Popup>
    </CircleMarker>
  );
};

const DebugCells = () => {
  const { searchLocation, searchRadius, resolutions } = useDentistsState();

  const resolution = Object.keys(resolutions).length > 0 ? resolutionForRadius(searchRadius, resolutions) : 0;
  const cells = getCellsWithinGeoRadius(searchLocation.lat, searchLocation.lng, searchRadius, resolution);
  const cellPolygons = cells.map((cell) => h3ToGeoBoundary(cell));

  console.log(`Loading ${cells.length} cells for radius ${searchRadius} at resolution ${resolution}`);
  return (
    <>
      {cellPolygons.map((poly, i) => (
        <Polygon key={i} positions={poly} pathOptions={{ color: "red", fillOpacity: 0.25, opacity: 0.25 }} />
      ))}
    </>
  );
};

const Map = ({ showCells = false }) => {
  const { dentists } = useDentistsState();
  const [dentistsAcceptingPatients, dentistsNotAcceptingPatients] = dentists.reduce(
    ([pass, fail], dentist) => {
      const acceptingAnyPatients = Object.values(dentist.AcceptingPatients).some((v) => v);
      return acceptingAnyPatients ? [[...pass, dentist], fail] : [pass, [...fail, dentist]];
    },
    [[], []]
  );

  // Geographic centre of GB - https://en.wikipedia.org/wiki/Centre_points_of_the_United_Kingdom#Great_Britain
  const center = [54.01, -2.33];
  const zoom = 7;

  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useResizeObserver(containerRef, () => {
    mapRef?.current?.invalidateSize();
  });

  return (
    <div ref={containerRef} className="w-full h-full">
      <MapContainer ref={mapRef} center={center} zoom={zoom} scrollWheelZoom={true} preferCanvas={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapZoomer />
        {showCells && <DebugCells />}
        <FeatureGroup>
          {dentistsNotAcceptingPatients.map(
            (dentist) =>
              dentist.Latitude && dentist.Longitude && <DentistCircle key={dentist.ODSCode} dentist={dentist} />
          )}
        </FeatureGroup>
        <FeatureGroup>
          {dentistsAcceptingPatients.map(
            (dentist) =>
              dentist.Latitude && dentist.Longitude && <DentistCircle key={dentist.ODSCode} dentist={dentist} />
          )}
        </FeatureGroup>
      </MapContainer>
      <style>
        {`
          .leaflet-container {
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default Map;
