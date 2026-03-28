import { CHUNKS_FOLDER_PATH, getCellsWithinGeoRadius, MANIFEST_PATH, mapDentists, resolutionForRadius } from "./core";
import { Dentist } from "./types/Dentist";
import { IndexManifest } from "./types/IndexManifest";
import { RawDentist } from "./types/RawDentist";

export const loadManifest = async (): Promise<IndexManifest> => {
  const res = await fetch(MANIFEST_PATH);
  if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`);
  return res.json();
};

export const loadCell = async (cell: string): Promise<RawDentist[]> => {
  const res = await fetch(`${CHUNKS_FOLDER_PATH}/${cell}.json`);
  if (!res.ok) throw new Error(`Failed to load cell ${cell}: ${res.status}`);
  return res.json();
};

export const loadDentists = async (lat: number, lng: number, radius: number): Promise<Dentist[]> => {
  const { resolutions, chunks } = await loadManifest();
  const resolution = resolutionForRadius(radius, resolutions);
  const cells = getCellsWithinGeoRadius(lat, lng, radius, resolution);

  const allRaw = (await Promise.all(cells.filter((cell) => chunks.includes(cell)).map(loadCell))).flat(1);

  // Deduplicate dentists that appear in multiple H3 cells
  const unique = [...new Map(allRaw.map((d) => [d.ODSCode, d])).values()];

  return unique.map(mapDentists);
};
