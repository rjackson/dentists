import path from "path";
import { readFileSync } from "fs";

import { CHUNKS_FOLDER_PATH, getCellsWithinGeoRadius, MANIFEST_PATH, mapDentists } from "./core";

export const CHUNKS_FOLDER = path.join(process.cwd(), `public/${CHUNKS_FOLDER_PATH}`);
export const MANIFEST = path.join(process.cwd(), `public/${MANIFEST_PATH}`);

/**
 * @returns {IndexManifest}
 */
export const loadManifest = () => {
  return JSON.parse(readFileSync(MANIFEST));
};

/**
 *
 * @param {string} cell
 * @returns {RawDentist[]}
 */
export const loadCell = (cell) => {
  return JSON.parse(readFileSync(path.join(CHUNKS_FOLDER, `${cell}.json`)));
};

/**
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius
 * @returns {Dentist[]}
 */
export const loadDentists = (lat, lng, radius) => {
  const { resolution, chunks } = loadManifest();
  const cells = getCellsWithinGeoRadius(lat, lng, radius, resolution);

  return cells
    .filter((cell) => chunks.includes(cell))
    .flatMap(loadCell)
    .map(mapDentists);
};
