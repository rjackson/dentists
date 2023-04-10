import { mapFromNhs } from "@helpers/DentalAcceptance";
import circle from "@turf/circle";
import { polyfill } from "h3-js";
import { ResolutionsMap } from "./types/ResolutionsMap";
import { RawDentist } from "./types/RawDentist";

export const CHUNKS_FOLDER_PATH = "/dentists";
export const MANIFEST_PATH = "/dentists/manifest.json";

export const getCellsWithinGeoRadius = (lat: number, lng: number, radiusKm: number, resolution: number): string[] => {
  const container = circle([lng, lat], radiusKm);
  return polyfill(container.geometry.coordinates, resolution, true);
};

export const mapDentists = (dentist: RawDentist) => ({
  ...dentist,
  AcceptingPatients: mapFromNhs(dentist.AcceptingPatients.Dentist),
});

export const resolutionForRadius = (searchRadius: number, resolutionToMaxRadiiMap: ResolutionsMap) => {
  const appropriateResolutions = Object.entries(resolutionToMaxRadiiMap)
    .filter(([, maxRadii]) => {
      return searchRadius <= maxRadii;
    })
    .map(([resolution]) => resolution);

  // Search radius our maximum radius by all resolutions. Return lowest resolution
  if (!appropriateResolutions.length) {
    return Math.min(...Object.keys(resolutionToMaxRadiiMap).map(Number));
  }

  // Otherwise, highest appropriate resolution
  return Math.max(...appropriateResolutions.map(Number));
};
