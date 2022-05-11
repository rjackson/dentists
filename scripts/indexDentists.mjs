/**
 * Split our dentist data files into smaller geographically chunked files, which
 * we can load on-demand depending on a user's search parameters.
 * *
 * This is intended to be ran as a pre-build step, and will output files
 * directly into the public folder.
 */
import path from "path";
import process from "process";
import { readFileSync, writeFileSync } from "fs";
import { geoToH3 } from "h3-js";

// https://h3geo.org/docs/core-library/restable
const H3_RESOLUTION = 7;

// const INPUT_FILE = path.join(process.cwd(), "data/dentists.json");
const INPUT_FILE = path.join(process.cwd(), "data/small-dentists.json");
const OUTPUT_FOLDER = path.join(process.cwd(), "public/dentists");
const OUTPUT_MANIFEST = path.join(process.cwd(), "public/dentists/manifest.json");

const dentists = JSON.parse(readFileSync(INPUT_FILE));

const chunks = dentists.reduce((chunks, dentist, i) => {
  const { Latitude, Longitude } = dentist;
  const index = geoToH3(Latitude, Longitude, H3_RESOLUTION);
  return {
    ...chunks,
    [index]: [...(chunks[index] ?? []), dentist],
  };
}, {});

const largestChunkLength = Object.entries(chunks).reduce(
  (biggest, [index, dentists]) => (dentists.length > biggest ? dentists.length : biggest),
  0
);
const smallestChunkLength = Object.entries(chunks).reduce(
  (smallest, [index, dentists]) => (dentists.length < smallest ? dentists.length : smallest),
  Number.MAX_VALUE
);

console.log(
  `Indexed ${dentists.length} into ${
    Object.keys(chunks).length
  } chunks (biggest: ${largestChunkLength}, smallest: ${smallestChunkLength}.}`
);

// Save chunks into separate files
Object.entries(chunks).map(([index, dentists]) => {
  writeFileSync(path.join(OUTPUT_FOLDER, `${index}.json`), JSON.stringify(dentists, null, 2));
});

// Write a manifest, indicating which h3 indexes we have data within (prevent network requests that will 404)
writeFileSync(
  OUTPUT_MANIFEST,
  JSON.stringify(
    {
      resolution: H3_RESOLUTION,
      chunks: Object.keys(chunks),
    },
    null,
    2
  )
);
