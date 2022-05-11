import { mapFromNhs } from "@helpers/DentalAcceptance";
import circle from "@turf/circle";
import { polyfill } from "h3-js";

export const CHUNKS_FOLDER_PATH = "/dentists";
export const MANIFEST_PATH = "/dentists/manifest.json";

export const getCellsWithinGeoRadius = (lat, lng, radiusKm, resolution) => {
  const container = circle([lng, lat], radiusKm);
  return polyfill(container.geometry.coordinates, resolution, true);
};

export const mapDentists = (dentist) => ({
  ...dentist,
  AcceptingPatients: mapFromNhs(dentist.AcceptingPatients.Dentist),
});
