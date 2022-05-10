import { mapFromNhs } from "@helpers/DentalAcceptance";
import { geoToH3, kRing, edgeLength, UNITS as H3UNITS } from "h3-js";

export const CHUNKS_FOLDER_PATH = "/dentists";
export const MANIFEST_PATH = "/dentists/manifest.json";

export const getCellsWithinGeoRadius = (lat, lng, radiusKm, resolution) => {
  // Approximately how many cells do we have to traverse to contain our radius
  // (i.e. we want overlap)
  const origin = geoToH3(lat, lng, resolution);
  const radius = Math.ceil(radiusKm / edgeLength(resolution, H3UNITS.km));
  return kRing(origin, radius);
};

export const mapDentists = (dentist) => ({
  ...dentist,
  AcceptingPatients: mapFromNhs(dentist.AcceptingPatients.Dentist),
});
