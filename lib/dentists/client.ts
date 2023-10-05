import { CHUNKS_FOLDER_PATH, getCellsWithinGeoRadius, MANIFEST_PATH, mapDentists, resolutionForRadius } from "./core";
import { Dentist } from "./types/Dentist";
import { IndexManifest } from "./types/IndexManifest";
import { RawDentist } from "./types/RawDentist";

export const loadManifest = async (): Promise<IndexManifest> => {
  return await fetch(MANIFEST_PATH).then((res) => res.json());
};

export const loadCell = async (cell: string): Promise<RawDentist[]> => {
  return fetch(`${CHUNKS_FOLDER_PATH}/${cell}.json`).then((res) => res.json());
};

export const loadDentists = async (lat: number, lng: number, radius: number): Promise<Dentist[]> => {
  const { resolutions, chunks } = await loadManifest();
  const resolution = resolutionForRadius(radius, resolutions);
  const cells = getCellsWithinGeoRadius(lat, lng, radius, resolution);

  return (await Promise.all(cells.filter((cell) => chunks.includes(cell)).map(loadCell))).flat(1).map(mapDentists);
};
