import { Circle, CircleMarker, MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import DentistInfo from "./DentistInfo";
import { useDentistsState } from "contexts/Dentists";
import { getCellsWithinGeoRadius } from "lib/dentists/core";
import { h3ToGeoBoundary } from "h3-js";

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
        {showCells && (
          <>
            <Circle
              center={[searchLocation.lat, searchLocation.lng]}
              radius={searchRadius * 1000}
              pathOptions={{ color: "yellow", fillOpacity: 0 }}
            />
            {cellPolygons.map((poly, i) => (
              <Polygon key={i} positions={poly} pathOptions={{ color: "red", fillOpacity: 0.25, opacity: 0.25 }} />
            ))}
          </>
        )}
        {dentists.map(
          (dentist) =>
            dentist.Latitude &&
            dentist.Longitude && (
              <CircleMarker key={dentist.ODSCode} center={[dentist.Latitude, dentist.Longitude]}>
                <Popup>
                  <DentistInfo dentist={dentist} />
                </Popup>
              </CircleMarker>
            )
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
