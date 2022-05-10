/**
 * The NHS feed returns dental acceptance as a list of objects, with an Id, Name, and AcceptingPatients boolean.
 *
 * With this helper, we will remap that into an object with distinct boolean keys, and have constants representing the unique values.
 *
 * Source data, for example:
 *  $ cat data/dentists.json | jq '[.[].AcceptingPatients.Dentist[] | {Id, Name, AcceptingPatients: false}] | unique_by(.Name)'
 *  [
 *    {
 *      "Id": 1,
 *      "Name": "Adults (18 and over)",
 *      "AcceptingPatients": false
 *    },
 *    {
 *      "Id": 2,
 *      "Name": "Adults entitled to free dental care",
 *      "AcceptingPatients": false
 *    },
 *    {
 *      "Id": 3,
 *      "Name": "Children (up to the age of 18)",
 *      "AcceptingPatients": false
 *    },
 *    {
 *      "Id": 5,
 *      "Name": "Only by referral from a dental practitioner",
 *      "AcceptingPatients": false
 *    },
 *    {
 *      "Id": 4,
 *      "Name": "Urgent care appointments offered",
 *      "AcceptingPatients": false
 *    }
 *  ]
 */

// Hardcoding mappings to IDs. Yuck. Somehow suspect they'll be more stable than the names though.
const ACCEPTANCE_MAPPING = {
  1: "AcceptingAdults", // Adults (18 and over)
  2: "AcceptingAdultsEntitled", // Adults entitled to free dental care
  3: "AcceptingChildren", // Children (up to the age of 18)
  4: "AcceptingUrgent", // Urgent care appointments offered
  5: "AcceptingReferrals", // Only by referral from a dental practitioner
};

export const ACCEPTANCE_TYPES = {
  AcceptingAdults: "Adults (18 and over)",
  AcceptingAdultsEntitled: "Adults entitled to free dental care",
  AcceptingChildren: "Children (up to the age of 18)",
  AcceptingUrgent: "Urgent care appointments offered",
  AcceptingReferrals: "Only by referral from a dental practitioner",
};

/**
 *
 * @param {{Id: string, Name: string, AcceptingPatients: bool}} nhsDentalAcceptanceObj
 * @returns {AcceptingPatientsBlock}
 */
export const mapFromNhs = (nhsDentalAcceptanceObj) => {
  const entries = nhsDentalAcceptanceObj.map(({ Id, Name, AcceptingPatients }) => {
    return [
      ACCEPTANCE_MAPPING[Id], // Keyed by constant
      AcceptingPatients, // Value is the boolean of whether they're accepting patients
    ];
  });
  return Object.fromEntries(entries);
};
