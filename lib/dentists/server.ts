import path from "path";
import { readFileSync } from "fs";

import { CHUNKS_FOLDER_PATH, getCellsWithinGeoRadius, MANIFEST_PATH, mapDentists, resolutionForRadius } from "./core";
import { RawDentist } from "./types/RawDentist";
import { IndexManifest } from "./types/IndexManifest";
import { Dentist } from "./types/Dentist";

export const CHUNKS_FOLDER = path.join(process.cwd(), `public/${CHUNKS_FOLDER_PATH}`);
export const MANIFEST = path.join(process.cwd(), `public/${MANIFEST_PATH}`);

export const loadManifest = (): IndexManifest => {
  return JSON.parse(readFileSync(MANIFEST).toString());
};

export const loadCell = (cell: string): RawDentist[] => {
  return JSON.parse(readFileSync(path.join(CHUNKS_FOLDER, `${cell}.json`)).toString());
};

export const loadDentists = (lat: number, lng: number, radius: number): Dentist[] => {
  const { resolutions, chunks } = loadManifest();
  const resolution = resolutionForRadius(radius, resolutions);
  const cells = getCellsWithinGeoRadius(lat, lng, radius, resolution);

  return cells
    .filter((cell) => chunks.includes(cell))
    .flatMap(loadCell)
    .map(mapDentists);
};
