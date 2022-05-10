import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import DentistInfo from "./DentistInfo";
import { useDentistsState } from "contexts/Dentists";

const Map = () => {
  const { dentists } = useDentistsState();

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
