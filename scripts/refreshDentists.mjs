import nextEnv from "@next/env";

import path from "path";
import { writeFileSync } from "fs";
import fetch from "node-fetch";

nextEnv.loadEnvConfig(process.cwd());
const baseUrl = process.env.NHSDIGITAL_ODATA_ENDPOINT.replace("//$/", "");
const subscriptionKey = process.env.NHSDIGITAL_ODATA_SUBSCRIPTION_KEY;

const OUTPUT_FILE = path.join(process.cwd(), "data/dentists.json");

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

    /* NHS Digital API has an internal URL that doesn't work. Instead of using
     * the link they give us, we'll just extract the appropriate offset for the
     * next page of results
     */
    const [, nextOffset] = data?.["@odata.nextLink"]?.match(/\$skip=([0-9]+)/) ?? [undefined, undefined];

    return [...data.value, ...(nextOffset ? await getAllDentists(nextOffset) : [])];
  } catch (e) {
    console.log(e);
    return [];
  }
};

const dentists = await getAllDentists();

writeFileSync(OUTPUT_FILE, JSON.stringify(dentists, null, 2));
