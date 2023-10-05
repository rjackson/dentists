/**
 * Fetch all Dentist organisations from the NHS Service Search API and save them
 * into two files:
 * - data/dentists.json: The full list
 * - data/small-dentists.json: The same list, reduced to only the properties our
 * application needs
 */

import nextEnv from "@next/env";

import path from "path";
import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";

nextEnv.loadEnvConfig(process.cwd());
const baseUrl = process.env.NHSDIGITAL_ODATA_ENDPOINT.replace("//$/", "");
const subscriptionKey = process.env.NHSDIGITAL_ODATA_SUBSCRIPTION_KEY;

const DENTISTS_FILE = path.join(process.cwd(), "data/dentists.json");
const SMALL_DENTISTS_FILE = path.join(process.cwd(), "data/small-dentists.json");
const CHANGED_DENTISTS_FILE = path.join(process.cwd(), "data/changed-dentists.json");

const getAllDentists = async (offset = 0) => {
  try {
    const response = await fetch(
      `${baseUrl}/service-search/?` +
        new URLSearchParams({
          "api-version": 2,
          $skip: offset,
          $top: 9999,
          $filter: `OrganisationTypeId eq 'DEN'`,
          $orderby: `ODSCode asc`,
        }),
      {
        headers: {
          "subscription-key": subscriptionKey,
        },
      }
    );
    const data = await response.json();

    if ("error" in data) {
      const { code, message } = data.error;
      throw `Error fetching dentists. Code '${code}', message '${message}'`;
    }

    if ("statusCode" in data) {
      const { statusCode, message } = data;
      throw `Error fetching dentists. Code '${statusCode}', message '${message}'`;
    }

    /* NHS Digital API has an internal URL that doesn't work. Instead of using
     * the link they give us, we'll just extract the appropriate offset for the
     * next page of results
     */
    const [, nextOffset] = data?.["@odata.nextLink"]?.match(/\$skip=([0-9]+)/) ?? [undefined, undefined];

    return [...data?.value, ...(nextOffset ? await getAllDentists(nextOffset) : [])];
  } catch (e) {
    console.log(e);
    return false;
  }
};

const dentists = await getAllDentists();

// Slimmer set of dentists to build the site (we don't need all data, and Netlify has refused to build with the whole lot)
const smallerDentists = (dentists === false ? [] : dentists).map(
  ({
    ODSCode,
    OrganisationName,
    Latitude,
    Longitude,
    AcceptingPatients,
    LastUpdatedDates: { DentistsAcceptingPatients: DentistsAcceptingPatientsLastUpdatedDate },
    City,
    Postcode,
  }) => ({
    ODSCode,
    OrganisationName,
    Latitude,
    Longitude,
    AcceptingPatients,
    DentistsAcceptingPatientsLastUpdatedDate,
    City,
    Postcode,
  })
);

if (!dentists || dentists.length === 0) {
  process.exit(1);
}

// For alerts we need to identify changes between dentists.
const previousSmallerDentists = JSON.parse(readFileSync(SMALL_DENTISTS_FILE));
const previousSmallerDentistsByODSCode = new Map(previousSmallerDentists.map((dentist) => [dentist.ODSCode, dentist]));

const changedDentistsByODSCode = Object.fromEntries(
  smallerDentists
    .map((currentDentist) => {
      const previousDentist = previousSmallerDentistsByODSCode.get(currentDentist.ODSCode);
      return [currentDentist.ODSCode, { previousDentist, currentDentist }];
    })
    .filter(
      ([, { previousDentist, currentDentist }]) =>
        previousDentist.DentistsAcceptingPatientsLastUpdatedDate !==
        currentDentist.DentistsAcceptingPatientsLastUpdatedDate
    )
);

// Write latest data to file
writeFileSync(DENTISTS_FILE, JSON.stringify(dentists, null, 2));
writeFileSync(SMALL_DENTISTS_FILE, JSON.stringify(smallerDentists, null, 2));
writeFileSync(CHANGED_DENTISTS_FILE, JSON.stringify(changedDentistsByODSCode, null, 2));
