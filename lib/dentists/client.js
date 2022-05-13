import { CHUNKS_FOLDER_PATH, getCellsWithinGeoRadius, MANIFEST_PATH, mapDentists, resolutionForRadius } from "./core";

/**
 * @returns {Promise<IndexManifest>}
 */
export const loadManifest = async () => {
  return await fetch(MANIFEST_PATH).then((res) => res.json());
};

/**
 *
 * @param {string} cell
 * @returns {Promise<RawDentist[]>}
 */
export const loadCell = async (cell) => {
  return fetch(`${CHUNKS_FOLDER_PATH}/${cell}.json`).then((res) => res.json());
};

/**
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius
 * @returns {Promise<Dentist[]>}
 */
export const loadDentists = async (lat, lng, radius) => {
  const { resolutions, chunks } = await loadManifest();
  const resolution = resolutionForRadius(radius, resolutions);
  const cells = getCellsWithinGeoRadius(lat, lng, radius, resolution);

  return (await Promise.all(cells.filter((cell) => chunks.includes(cell)).map(loadCell))).flat(1).map(mapDentists);
};
