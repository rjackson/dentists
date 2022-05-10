/**
 * @typedef {Object} IndexManifest
 * @property {number} resolution
 * @property {string[]} chunks
 */

/**
 * @typedef {Object} RawAcceptingPatientsEntry
 * @property {string} Id
 * @property {string} Name
 * @property {bool} AcceptingPatients
 */

/**
 * @typedef {Object} RawDentist
 * @property {string} ODSCode
 * @property {string} OrganisationName
 * @property {number} Latitude
 * @property {number} Longitude
 * @property {{GP: null, Dentist: RawAcceptingPatientsEntry[]}} AcceptingPatients
 * @property {string} DentistsAcceptingPatientsLastUpdatedDate
 */

/**
 * @typedef {Object} AcceptingPatientsBlock
 * @property {string} AcceptingAdults
 * @property {string} AcceptingAdultsEntitled
 * @property {string} AcceptingChildren
 * @property {string} AcceptingUrgent
 * @property {string} AcceptingReferrals
 */

/**
 * @typedef {Object} Dentist
 * @property {string} ODSCode
 * @property {string} OrganisationName
 * @property {number} Latitude
 * @property {number} Longitude
 * @property {AcceptingPatientsBlock} AcceptingPatients
 * @property {string} DentistsAcceptingPatientsLastUpdatedDate
 */
